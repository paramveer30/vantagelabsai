// Email bodies for the contact endpoint. Kept pure so they can be unit tested
// and so route.ts stays focused on transport and error handling.

export type ContactSubmission = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export function buildTeamNotification({
  name,
  email,
  company,
  message,
}: ContactSubmission): { subject: string; text: string } {
  return {
    subject: `New enquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      "",
      message,
    ]
      .filter((line): line is string => line !== null)
      .join("\n"),
  };
}
