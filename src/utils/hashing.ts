export const short = (value: string, n = 10): string =>
  `${value.slice(0, n)}…${value.slice(-6)}`

export const seedHash = (seed: string): string =>
  Array.from(
    { length: 64 },
    (_, i) =>
      "0123456789abcdef"[(seed.charCodeAt(i % seed.length) + i * 7) % 16],
  ).join("")

export const sha256 = async (input: string): Promise<string> => {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  )
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("")
}
