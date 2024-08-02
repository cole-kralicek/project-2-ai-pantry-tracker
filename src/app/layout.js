export const metadata = {
  title: 'AI Pantry App',
  description: 'By Cole Kralicek',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
