import React, { useEffect, useState } from 'react'
import { FaSyncAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            initial={{
                y: -100,
            }}
            animate={{
                y: 0,
            }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                padding: '1rem 1.5rem',
                transition: 'all 0.3s ease',
                background: scrolled ? 'rgba(3, 7, 18, 0.8)' : 'transparent',
                backdropFilter: scrolled ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
                borderBottom: scrolled
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : '1px solid transparent',
            }}
        >
            <div
                className="container"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <motion.div
                    whileHover={{
                        scale: 1.05,
                    }}
                    whileTap={{
                        scale: 0.95,
                    }}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '2.5rem',
                            height: '2.5rem',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '0.75rem',
                            color: 'white',
                        }}
                    >
                        <FaSyncAlt size={18} />
                    </div>
                    <span
                        style={{
                            letterSpacing: '-0.03em',
                        }}
                    >
                        CareerSync
                    </span>
                </motion.div>

                <div
                    className="hidden md:flex"
                    style={{
                        gap: '2.5rem',
                        alignItems: 'center',
                    }}
                >
                    <a
                        href="#features"
                        style={{
                            color: '#e2e8f0',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                    >
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        style={{
                            color: '#e2e8f0',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                    >
                        How It Works
                    </a>
                    <a
                        href="#companies"
                        style={{
                            color: '#e2e8f0',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = 'white')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                    >
                        Companies
                    </a>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                    }}
                >
                    <a
                        href="/login"
                        className="btn btn-white"
                        style={{
                            padding: '0.5rem 1.25rem',
                            fontSize: '0.875rem',
                        }}
                    >
                        Login
                    </a>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar