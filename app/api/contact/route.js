import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const RECIPIENTS = [
  'andy@theandylife.com',
  'jos@profitgeeks.com.au',
]
const SENDER = 'noreply@australianpropertymarketing.com.au'

const AC_API_URL = process.env.ACTIVECAMPAIGN_API_URL
const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY
const AC_LIST_ID = process.env.ACTIVECAMPAIGN_LIST_ID

async function addToActiveCampaign(email) {
  // Create or update the contact
  const contactRes = await fetch(`${AC_API_URL}/api/3/contact/sync`, {
    method: 'POST',
    headers: { 'Api-Token': AC_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contact: { email } }),
  })
  if (!contactRes.ok) {
    const err = await contactRes.text()
    throw new Error(`ActiveCampaign contact sync failed: ${err}`)
  }
  const { contact } = await contactRes.json()

  // Subscribe contact to the newsletter list
  const listRes = await fetch(`${AC_API_URL}/api/3/contactLists`, {
    method: 'POST',
    headers: { 'Api-Token': AC_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contactList: { list: AC_LIST_ID, contact: contact.id, status: 1 } }),
  })
  if (!listRes.ok) {
    const err = await listRes.text()
    throw new Error(`ActiveCampaign list subscribe failed: ${err}`)
  }
}

const REQUIRED_FIELDS = {
  contact: ['name', 'email', 'subject', 'message'],
  audit: ['name', 'email', 'phone', 'agency', 'agents', 'spend'],
  landing: ['name', 'email', 'phone', 'agency', 'agents', 'spend'],
  newsletter: ['email'],
}

function formatLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
}

function buildHtml(formType, data) {
  const title = {
    contact: 'New Contact Form Submission',
    audit: 'New Audit Discovery Call Request',
    landing: `New Landing Page Lead${data.location ? ` (${data.location})` : ''}`,
    newsletter: 'New Newsletter Subscription',
  }[formType]

  const rows = Object.entries(data)
    .filter(([key]) => key !== 'formType')
    .map(([key, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;width:160px;">${formatLabel(key)}</td>
        <td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #e5e7eb;">${String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
      </tr>`)
    .join('')

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1a2e;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:#ffffff;margin:0;font-size:20px;">${title}</h1>
      </div>
      <div style="background:#ffffff;padding:24px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        <p style="margin-top:24px;font-size:13px;color:#6b7280;">Sent from australianpropertymarketing.com.au</p>
      </div>
    </div>`
}

export async function POST(request) {
  try {
    const data = await request.json()
    const { formType } = data

    if (!formType || !REQUIRED_FIELDS[formType]) {
      return Response.json({ error: 'Invalid form type' }, { status: 400 })
    }

    const missing = REQUIRED_FIELDS[formType].filter(f => !data[f]?.trim())
    if (missing.length > 0) {
      return Response.json(
        { error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    const subjectLine = {
      contact: `Contact: ${data.name} — ${data.subject}`,
      audit: `Audit Request: ${data.name} (${data.agency})`,
      landing: `LP Lead: ${data.name} (${data.agency})${data.location ? ` — ${data.location}` : ''}`,
      newsletter: `Newsletter: ${data.email}`,
    }[formType]

    await sgMail.send({
      to: RECIPIENTS,
      from: SENDER,
      subject: subjectLine,
      html: buildHtml(formType, data),
    })

    if (formType === 'newsletter') {
      await addToActiveCampaign(data.email)
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('SendGrid error:', error?.response?.body || error)
    const detail = error?.response?.body?.errors?.[0]?.message || error.message || 'Failed to send message'
    return Response.json({ error: detail }, { status: 500 })
  }
}
