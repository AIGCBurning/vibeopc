export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ success: false, error: "Invalid email address" }), {
        status: 400,
        headers,
      });
    }

    const RESEND_API_KEY = env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ success: false, error: "Server configuration error" }), {
        status: 500,
        headers,
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "vibeOPC Waitlist <onboarding@resend.dev>",
        to: "ironm6028@gmail.com",
        subject: "New Waitlist Signup: " + email,
        html: "<h2>New Waitlist Signup</h2><p><strong>Email:</strong> " + email + "</p><p><strong>Time:</strong> " + new Date().toISOString() + "</p>",
      }),
    });

    if (!res.ok) {
      const errData = await res.text();
      console.error("Resend API error:", errData);
      return new Response(JSON.stringify({ success: false, error: "Failed to send notification" }), {
        status: 500,
        headers,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    console.error("Waitlist error:", err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
      headers,
    });
  }
}

// Handle preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
