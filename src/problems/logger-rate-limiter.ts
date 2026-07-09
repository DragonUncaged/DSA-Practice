import type { Problem } from '@/lib/types'

export const loggerRateLimiter: Problem = {
  id: 'logger-rate-limiter',
  title: 'Logger Rate Limiter',
  group: 'Easy',
  pattern: 'Design',
  difficulty: 'Easy',
  leetcode: 'https://leetcode.com/problems/logger-rate-limiter/',
  statement:
    'Design a `Logger` whose `shouldPrintMessage(timestamp, message)` returns true only when that exact message has not been printed in the last 10 seconds. Timestamps arrive in non-decreasing order. A map from message to the next timestamp it is allowed at answers each call in `O(1)`.',
  constraints: [
    '0 <= timestamp <= 10^9',
    'Timestamps arrive in non-decreasing order',
    '1 <= message.length <= 30',
    'At most 10^4 calls are made to shouldPrintMessage',
  ],
}
