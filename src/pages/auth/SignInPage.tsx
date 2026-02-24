import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            {/* Logo / Branding */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'linear-gradient(135deg, var(--forest-green), var(--primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 32px rgba(30, 80, 55, 0.4)',
                }}>
                    <span className="material-symbols-outlined filled" style={{ color: 'white', fontSize: 40 }}>
                        volunteer_activism
                    </span>
                </div>
                <h1 style={{
                    fontSize: 32, fontWeight: 900,
                    color: 'var(--forest-green)',
                    letterSpacing: '-0.02em',
                }}>
                    Trombetas
                </h1>
                <p style={{
                    fontSize: 15, color: 'var(--text-muted)',
                    fontWeight: 500, marginTop: 6,
                }}>
                    Onde a fé encontra pessoas 🙏
                </p>
            </div>

            {/* Clerk SignIn widget */}
            <SignIn
                routing="hash"
                afterSignInUrl="/"
                appearance={{
                    layout: {
                        logoPlacement: 'none',
                    },
                    variables: {
                        colorPrimary: '#1e5037',
                        colorBackground: '#1a1f1c',
                        colorText: '#e8f0ec',
                        colorTextSecondary: '#8a9e93',
                        colorInputBackground: '#232b27',
                        colorInputText: '#e8f0ec',
                        borderRadius: '14px',
                        fontFamily: 'Manrope, sans-serif',
                    },
                    elements: {
                        card: {
                            background: '#1e2822',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
                        },
                        formButtonPrimary: {
                            background: 'linear-gradient(135deg, #1e5037, #2d7a55)',
                            fontWeight: 800,
                            fontSize: 15,
                        },
                        socialButtonsBlockButton: {
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.05)',
                            color: '#e8f0ec',
                        },
                        footerActionLink: {
                            color: '#5cb882',
                        },
                    },
                }}
            />
        </div>
    )
}
