/**
 * Email Service for Shabdly.online
 * Handles automated email sending via SendGrid API
 * 
 * Features:
 * - Welcome email on signup
 * - Scheduled follow-up emails (Day 3, Day 7)
 * - Email templates with dynamic content
 * - Regional Amazon SEO Checklist delivery
 */

interface EmailParams {
  to: string;
  name: string;
  subject: string;
  html: string;
  text?: string;
}

interface WelcomeEmailParams {
  email: string;
  name: string;
  userId: string;
}

interface FollowUpEmailParams {
  email: string;
  name: string;
  daysAfterSignup: number;
}

/**
 * Send email via SendGrid API
 */
export async function sendEmail(params: EmailParams, sendgridApiKey: string, fromEmail: string): Promise<boolean> {
  const { to, name, subject, html, text } = params;

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to, name: name }],
            subject: subject,
          },
        ],
        from: {
          email: fromEmail,
          name: 'Shabdly Team',
        },
        content: [
          {
            type: 'text/html',
            value: html,
          },
          ...(text ? [{
            type: 'text/plain',
            value: text,
          }] : []),
        ],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ Email sent successfully to ${to}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`❌ SendGrid API error (${response.status}):`, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

/**
 * Email Template: Welcome Email (Sent immediately on signup)
 */
export function getWelcomeEmailTemplate(params: WelcomeEmailParams): { subject: string; html: string; text: string } {
  const { name } = params;

  const subject = "Welcome to Shabdly! 🚀 Ready to unlock Bharat?";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Shabdly</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 20px;
        }
        h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 30px;
        }
        .tip-box {
            background: #f3f4f6;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .tip-title {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
            font-size: 16px;
        }
        .tip-description {
            color: #4b5563;
            font-size: 14px;
            line-height: 1.5;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 30px 0;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
        }
        .help-section {
            background: #fef3c7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .ps-section {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }
        .ps-section strong {
            font-size: 16px;
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://shabdly.online/static/shabdly-logo.png" alt="Shabdly Logo" class="logo">
            <h1>Welcome to the future of regional e-commerce!</h1>
            <p class="subtitle">
                You've just taken the first step toward reaching 500 million+ shoppers in India who prefer to shop in their mother tongue.
            </p>
        </div>

        <p>Hi <strong>${name}</strong>,</p>

        <p>
            Shabdly.online isn't just a translator; it's your AI-powered growth partner for Tier 2 and Tier 3 markets.
        </p>

        <h2 style="color: #1f2937; margin-top: 30px;">3 Tips to Get the Best Results:</h2>

        <div class="tip-box">
            <div class="tip-title">🚀 Use the "Bulk Upload" for Speed</div>
            <div class="tip-description">
                Don't waste time copy-pasting. Drop your Excel or CSV file into the dashboard, and we'll handle thousands of products in minutes.
            </div>
        </div>

        <div class="tip-box">
            <div class="tip-title">🔒 Lock Your Brand Names</div>
            <div class="tip-description">
                Use the "Brand Glossary" feature to ensure your brand name (e.g., "SwiftCook") doesn't get translated into a local word.
            </div>
        </div>

        <div class="tip-box">
            <div class="tip-title">🎯 Pick Your Vibe</div>
            <div class="tip-description">
                Choose the "Persuasive/Hinglish" tone for fashion and gadgets, or "Formal" for electronics. This ensures your products sound like a local salesman, not a textbook.
            </div>
        </div>

        <div style="text-align: center;">
            <a href="https://shabdly.online/dashboard" class="cta-button">
                Go to My Dashboard
            </a>
        </div>

        <div class="help-section">
            <h3 style="margin-top: 0; color: #92400e;">Need help?</h3>
            <p style="margin: 10px 0; color: #78350f;">
                Our <a href="https://shabdly.online/help" style="color: #92400e; font-weight: 600;">Help Center</a> is available 24/7. 
                Check out our <a href="https://shabdly.online/documentation" style="color: #92400e; font-weight: 600;">Quick Start Guide</a> for instant answers.
            </p>
        </div>

        <div class="ps-section">
            <strong>P.S.</strong> Yeh Dil Chahe Aur - Upgrade to the Growth Plan today and get <strong>20% extra word credits</strong> for your first month!
            <div style="margin-top: 15px;">
                <a href="https://shabdly.online/dashboard#pricing" style="color: white; text-decoration: underline; font-weight: 600;">
                    View Growth Plan Details →
                </a>
            </div>
        </div>

        <div class="footer">
            <p style="margin: 10px 0;"><strong>Happy Selling!</strong></p>
            <p style="margin: 10px 0;">The Shabdly Team</p>
            <p style="margin: 10px 0; font-style: italic;">Unlock Bharat. One word at a time.</p>
            <p style="margin: 20px 0 10px 0;">
                <a href="https://shabdly.online" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Website</a> |
                <a href="https://shabdly.online/help" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Help Center</a> |
                <a href="https://shabdly.online/contact" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">Contact</a>
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                © 2026 Shabdly.online | Nagpur, Maharashtra, India
            </p>
        </div>
    </div>
</body>
</html>
  `;

  const text = `
Welcome to Shabdly! 🚀 Ready to unlock Bharat?

Hi ${name},

Welcome to the future of regional e-commerce!

You've just taken the first step toward reaching 500 million+ shoppers in India who prefer to shop in their mother tongue. Shabdly.online isn't just a translator; it's your AI-powered growth partner for Tier 2 and Tier 3 markets.

Here are 3 tips to get the best results from your first translation:

1. Use the "Bulk Upload" for Speed
   Don't waste time copy-pasting. Drop your Excel or CSV file into the dashboard, and we'll handle thousands of products in minutes.

2. Lock Your Brand Names
   Use the "Brand Glossary" feature to ensure your brand name (e.g., "SwiftCook") doesn't get translated into a local word.

3. Pick Your Vibe
   Choose the "Persuasive/Hinglish" tone for fashion and gadgets, or "Formal" for electronics. This ensures your products sound like a local salesman, not a textbook.

Ready to start?
Go to your dashboard: https://shabdly.online/dashboard

Need help?
Our Help Center is available 24/7: https://shabdly.online/help
Check out our Quick Start Guide: https://shabdly.online/documentation

Happy Selling!
The Shabdly Team
Unlock Bharat. One word at a time.

P.S. Yeh Dil Chahe Aur - Upgrade to the Growth Plan today and get 20% extra word credits for your first month!
View Growth Plan: https://shabdly.online/dashboard#pricing

---
© 2026 Shabdly.online | Nagpur, Maharashtra, India
Website: https://shabdly.online
  `;

  return { subject, html, text };
}

/**
 * Email Template: Day 3 Follow-Up (The Value Hook)
 */
export function getDay3EmailTemplate(params: FollowUpEmailParams): { subject: string; html: string; text: string } {
  const { name } = params;

  const subject = "Quick question about your listings...";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Question</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .highlight {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Quick question about your listings...</h1>
        
        <p>Hi <strong>${name}</strong>,</p>

        <p>
            It's been three days since you joined Shabdly. I wanted to check in—<strong>have you published your first regional language listing yet?</strong>
        </p>

        <p>
            Seeing your products in Hindi, Tamil, or Telugu for the first time is a game-changer for your conversion rates.
        </p>

        <div class="highlight">
            <h2 style="margin-top: 0; font-size: 20px;">🎁 Special Gift for You</h2>
            <p style="margin: 15px 0; font-size: 16px;">
                If you've gone live (or are about to), reply to this email with the word <strong>"YES"</strong>.
            </p>
            <p style="margin: 15px 0; font-size: 14px;">
                I'll instantly send over our <strong>"Regional Amazon SEO Checklist"</strong> — a 1-page guide on how to place your new translated keywords so you show up at the top of search results in Tier 2 and Tier 3 cities.
            </p>
        </div>

        <p style="text-align: center; font-size: 18px; color: #3b82f6; font-weight: 600;">
            I'm waiting for your "YES"!
        </p>

        <p style="margin-top: 30px;">
            Best,<br>
            <strong>The Shabdly Team</strong><br>
            <em>Founder, Shabdly.online</em>
        </p>

        <div class="footer">
            <p>
                <a href="https://shabdly.online/dashboard" class="cta-button">Go to Dashboard</a>
            </p>
            <p style="margin: 20px 0;">
                <a href="https://shabdly.online/help" style="color: #3b82f6; text-decoration: none;">Help Center</a> |
                <a href="https://shabdly.online/contact" style="color: #3b82f6; text-decoration: none;">Contact Us</a>
            </p>
            <p style="font-size: 12px; color: #9ca3af;">
                © 2026 Shabdly.online | Nagpur, Maharashtra, India
            </p>
        </div>
    </div>
</body>
</html>
  `;

  const text = `
Quick question about your listings...

Hi ${name},

It's been three days since you joined Shabdly. I wanted to check in—have you published your first regional language listing yet?

Seeing your products in Hindi, Tamil, or Telugu for the first time is a game-changer for your conversion rates.

🎁 SPECIAL GIFT FOR YOU

If you've gone live (or are about to), reply to this email with the word "YES".

Once you reply, I'll instantly send over our "Regional Amazon SEO Checklist." It's a 1-page guide on how to place your new translated keywords so you show up at the top of search results in Tier 2 and Tier 3 cities.

I'm waiting for your "YES"!

Best,
The Shabdly Team
Founder, Shabdly.online

Go to Dashboard: https://shabdly.online/dashboard
Help Center: https://shabdly.online/help

---
© 2026 Shabdly.online | Nagpur, Maharashtra, India
  `;

  return { subject, html, text };
}

/**
 * Email Template: Day 7 Follow-Up (Soft Upgrade Nudge)
 */
export function getDay7EmailTemplate(params: FollowUpEmailParams): { subject: string; html: string; text: string } {
  const { name } = params;

  const subject = "Your credits are waiting...";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Credits Are Waiting</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .stat-box {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }
        .stat-number {
            font-size: 48px;
            font-weight: 700;
            margin: 10px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
            font-size: 16px;
        }
        .help-box {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your credits are waiting...</h1>
        
        <p>Hi <strong>${name}</strong>,</p>

        <p>
            I noticed you haven't used your full translation credits yet.
        </p>

        <div class="stat-box">
            <div>The e-commerce market in Bharat is growing at</div>
            <div class="stat-number">25%</div>
            <div style="font-size: 18px; font-weight: 600;">year-on-year</div>
        </div>

        <p>
            <strong>Every day your listing stays "English-only" is a day a local competitor could be winning over your customers.</strong>
        </p>

        <div class="help-box">
            <h3 style="margin-top: 0; color: #1f2937;">Need a hand?</h3>
            <p style="margin: 10px 0;">
                If you're stuck on how to format your CSV or which language to start with, just hit reply. I'm here to help.
            </p>
        </div>

        <p style="text-align: center;">
            Otherwise, head back to your dashboard and let's get those listings translated:
        </p>

        <div style="text-align: center;">
            <a href="https://shabdly.online/dashboard" class="cta-button">
                Login to Shabdly Dashboard
            </a>
        </div>

        <p style="margin-top: 30px;">
            Talk soon,<br>
            <strong>The Shabdly Team</strong>
        </p>

        <div class="footer">
            <p style="margin: 20px 0;">
                <a href="https://shabdly.online/help" style="color: #3b82f6; text-decoration: none;">Help Center</a> |
                <a href="https://shabdly.online/documentation" style="color: #3b82f6; text-decoration: none;">Documentation</a> |
                <a href="https://shabdly.online/contact" style="color: #3b82f6; text-decoration: none;">Contact</a>
            </p>
            <p style="font-size: 12px; color: #9ca3af;">
                © 2026 Shabdly.online | Nagpur, Maharashtra, India
            </p>
        </div>
    </div>
</body>
</html>
  `;

  const text = `
Your credits are waiting...

Hi ${name},

I noticed you haven't used your full translation credits yet.

📊 DID YOU KNOW?
The e-commerce market in Bharat is growing at 25% year-on-year.

Every day your listing stays "English-only" is a day a local competitor could be winning over your customers.

NEED A HAND?
If you're stuck on how to format your CSV or which language to start with, just hit reply. I'm here to help.

Otherwise, head back to your dashboard and let's get those listings translated:
https://shabdly.online/dashboard

Talk soon,
The Shabdly Team

---
Help Center: https://shabdly.online/help
Documentation: https://shabdly.online/documentation

© 2026 Shabdly.online | Nagpur, Maharashtra, India
  `;

  return { subject, html, text };
}

/**
 * Send welcome email immediately after signup
 */
export async function sendWelcomeEmail(
  params: WelcomeEmailParams,
  sendgridApiKey: string,
  fromEmail: string
): Promise<boolean> {
  const { email, name } = params;
  const template = getWelcomeEmailTemplate(params);

  return await sendEmail(
    {
      to: email,
      name: name,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    sendgridApiKey,
    fromEmail
  );
}

/**
 * Schedule follow-up emails
 * Note: For Cloudflare Workers, you'll need to use Cloudflare Queues or an external scheduler like Zapier/Make
 */
export async function scheduleFollowUpEmail(
  params: FollowUpEmailParams,
  sendgridApiKey: string,
  fromEmail: string
): Promise<boolean> {
  const { email, name, daysAfterSignup } = params;
  
  let template;
  if (daysAfterSignup === 3) {
    template = getDay3EmailTemplate(params);
  } else if (daysAfterSignup === 7) {
    template = getDay7EmailTemplate(params);
  } else {
    console.error('Invalid daysAfterSignup value. Must be 3 or 7.');
    return false;
  }

  return await sendEmail(
    {
      to: email,
      name: name,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    sendgridApiKey,
    fromEmail
  );
}
