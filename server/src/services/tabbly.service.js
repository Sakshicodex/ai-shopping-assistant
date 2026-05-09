import config from '../config/env.js';

const TABBLY_API_URL = 'https://www.tabbly.io/dashboard/agents/endpoints';

export async function triggerCall(phoneNumber, firstLine, customInstruction) {
  const response = await fetch(`${TABBLY_API_URL}/trigger-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organization_id: parseInt(config.tabblyOrgId, 10),
      use_agent_id: parseInt(config.tabblyAgentId, 10),
      called_to: phoneNumber,
      call_from: config.tabblyPhoneNumber,
      custom_first_line: firstLine,
      custom_instruction: customInstruction,
      called_by_account: 'shopsmart_bot',
      api_key: config.tabblyApiKey,
      custom_identifiers: `customer_${Date.now()}`,
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Failed to trigger call');
  }

  return data;
}
