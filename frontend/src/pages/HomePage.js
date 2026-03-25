import React, { useEffect, useRef } from 'react'
import { Navbar } from '../components/Navbar'
import { motion, useInView, animate } from 'framer-motion'
import {
    FaRocket,
    FaSearch,
    FaClipboardList,
    FaBell,
    FaFileAlt,
    FaStar,
    FaCheckCircle,
    FaBuilding,
    FaUserGraduate,
    FaChartLine,
    FaBriefcase,
    FaTwitter,
    FaLinkedin,
    FaGithub,
    FaSyncAlt,
} from 'react-icons/fa'

const fadeInUp = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const staggerContainer = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const scaleUp = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

function AnimatedCounter({ from, to, suffix }) {
    const nodeRef = useRef(null)
    const inView = useInView(nodeRef, {
        once: true,
        margin: '-50px',
    })

    useEffect(() => {
        if (inView && nodeRef.current) {
            const controls = animate(from, to, {
                duration: 2.5,
                ease: 'easeOut',
                onUpdate(value) {
                    if (nodeRef.current) {
                        nodeRef.current.textContent = Math.round(value) + suffix
                    }
                },
            })
            return () => controls.stop()
        }
    }, [inView, from, to, suffix])

    return (
        <span ref={nodeRef}>
            {from}
            {suffix}
        </span>
    )
}

const HomePage = () => {
    return (
        <div className="page-wrapper">
            <Navbar />

            <section
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8rem 1.5rem 4rem',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '4rem',
                            alignItems: 'center',
                        }}
                    >
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.div
                                variants={fadeInUp}
                                className="badge"
                                style={{
                                    marginBottom: '2rem',
                                }}
                            >
                                <span
                                    style={{
                                        marginRight: '0.5rem',
                                    }}
                                >
                                    ✨
                                </span>{' '}
                                The New Standard for Careers
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                style={{
                                    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                Launch Your Career with <br />
                                <span className="text-gradient">CareerSync</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeInUp}
                                style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--color-text-muted)',
                                    marginBottom: '3rem',
                                    maxWidth: '500px',
                                }}
                            >
                                Seamlessly connect with top companies, build your professional
                                profile, and secure the internship that accelerates your future.
                            </motion.p>

                            <motion.div
                                variants={fadeInUp}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <a href="/register" className="btn btn-lg">
                                    Start Your Journey{' '}
                                    <FaRocket
                                        style={{
                                            marginLeft: '0.5rem',
                                        }}
                                    />
                                </a>
                                <a href="#features" className="btn btn-white btn-lg">
                                    Explore Opportunities
                                </a>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                duration: 1,
                                delay: 0.3,
                            }}
                            className="hero-visual"
                        >
                            <motion.div
                                className="glass-panel"
                                style={{
                                    width: '300px',
                                    height: '380px',
                                    zIndex: 2,
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                                animate={{
                                    y: [-10, 10, -10],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: 'easeInOut',
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            marginBottom: '1rem',
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: '8px',
                                            width: '60%',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: '4px',
                                            marginBottom: '0.5rem',
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: '8px',
                                            width: '40%',
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '1rem',
                                        padding: '1rem',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        <FaCheckCircle color="#10b981" size={20} />
                                        <span
                                            style={{
                                                fontSize: '0.875rem',
                                                color: '#e2e8f0',
                                            }}
                                        >
                                            Application Accepted
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                        }}
                                    >
                                        <FaBriefcase color="#8b5cf6" size={20} />
                                        <span
                                            style={{
                                                fontSize: '0.875rem',
                                                color: '#e2e8f0',
                                            }}
                                        >
                                            Interview Scheduled
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="glass-panel"
                                style={{
                                    width: '250px',
                                    height: '200px',
                                    position: 'absolute',
                                    top: '20px',
                                    right: '0',
                                    zIndex: 1,
                                    opacity: 0.5,
                                    transform: 'rotate(5deg)',
                                }}
                                animate={{
                                    y: [10, -10, 10],
                                    rotate: [5, 7, 5],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 7,
                                    ease: 'easeInOut',
                                    delay: 1,
                                }}
                            />
                            <motion.div
                                className="glass-panel"
                                style={{
                                    width: '200px',
                                    height: '150px',
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    zIndex: 3,
                                    opacity: 0.8,
                                    transform: 'rotate(-5deg)',
                                }}
                                animate={{
                                    y: [-5, 5, -5],
                                    rotate: [-5, -3, -5],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5,
                                    ease: 'easeInOut',
                                    delay: 0.5,
                                }}
                            >
                                <div
                                    style={{
                                        padding: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '0.75rem',
                                            background: 'rgba(99, 102, 241, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FaStar color="#818cf8" size={24} />
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            98%
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#94a3b8',
                                            }}
                                        >
                                            Match Rate
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section
                style={{
                    padding: '4rem 0',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: 'rgba(15, 23, 42, 0.3)',
                }}
            >
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-50px',
                        }}
                        variants={staggerContainer}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '2rem',
                            textAlign: 'center',
                        }}
                    >
                        {[
                            {
                                icon: <FaBriefcase />,
                                num: 1500,
                                suffix: '+',
                                label: 'Active Internships',
                            },
                            {
                                icon: <FaBuilding />,
                                num: 300,
                                suffix: '+',
                                label: 'Partner Companies',
                            },
                            {
                                icon: <FaUserGraduate />,
                                num: 5000,
                                suffix: '+',
                                label: 'Student Placements',
                            },
                            {
                                icon: <FaChartLine />,
                                num: 94,
                                suffix: '%',
                                label: 'Success Rate',
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={scaleUp}
                                style={{
                                    padding: '1rem',
                                }}
                            >
                                <div
                                    style={{
                                        color: 'var(--color-primary)',
                                        fontSize: '2rem',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {stat.icon}
                                </div>
                                <div
                                    style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 800,
                                        color: 'white',
                                        marginBottom: '0.5rem',
                                        lineHeight: 1,
                                    }}
                                >
                                    <AnimatedCounter
                                        from={0}
                                        to={stat.num}
                                        suffix={stat.suffix}
                                    />
                                </div>
                                <div
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section id="features" className="section">
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-100px',
                        }}
                        variants={fadeInUp}
                        className="text-center"
                        style={{
                            marginBottom: '5rem',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Why Choose <span className="text-gradient">CareerSync</span>
                        </h2>
                        <p
                            style={{
                                fontSize: '1.25rem',
                                color: 'var(--color-text-muted)',
                                maxWidth: '600px',
                                margin: '0 auto',
                            }}
                        >
                            A complete, intelligent platform designed for ambitious students
                            and forward-thinking employers.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-100px',
                        }}
                        variants={staggerContainer}
                    >
                        {[
                            {
                                icon: <FaSearch />,
                                title: 'Smart Search',
                                desc: 'Find internships that match your skills, faculty, and availability with our advanced AI-driven search system.',
                            },
                            {
                                icon: <FaClipboardList />,
                                title: 'Easy Applications',
                                desc: 'Apply to multiple internships with just a few clicks. Track all your applications in one unified dashboard.',
                            },
                            {
                                icon: <FaBell />,
                                title: 'Real-time Notifications',
                                desc: 'Get instant updates when employers review your application, shortlist you, or schedule an interview.',
                            },
                            {
                                icon: <FaFileAlt />,
                                title: 'CV Generator',
                                desc: 'Create a standout professional CV instantly using our built-in generator with industry-approved templates.',
                            },
                            {
                                icon: <FaStar />,
                                title: 'Company Reviews',
                                desc: 'Read honest, verified reviews from students who have interned at companies before you make your decision.',
                            },
                            {
                                icon: <FaCheckCircle />,
                                title: 'Verified Employers',
                                desc: 'Apply with confidence. All employers and opportunities are strictly vetted by our administrative team.',
                            },
                        ].map((feature, i) => (
                            <motion.div key={i} variants={scaleUp} className="card">
                                <div className="card-body">
                                    <div
                                        style={{
                                            width: '3.5rem',
                                            height: '3.5rem',
                                            borderRadius: '1rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: '#818cf8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            marginBottom: '1.5rem',
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3
                                        style={{
                                            fontSize: '1.25rem',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        {feature.title}
                                    </h3>
                                    <p
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section
                id="how-it-works"
                className="section"
                style={{
                    background: 'rgba(15, 23, 42, 0.3)',
                }}
            >
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-100px',
                        }}
                        variants={fadeInUp}
                        className="text-center"
                        style={{
                            marginBottom: '5rem',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                marginBottom: '1.25rem',
                            }}
                        >
                            How It Works
                        </h2>
                        <p
                            style={{
                                fontSize: '1.25rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            Your path to success in 4 simple steps
                        </p>
                    </motion.div>

                    <motion.div
                        className="timeline-container"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-100px',
                        }}
                        variants={staggerContainer}
                    >
                        <div className="timeline-line" />

                        {[
                            {
                                num: '01',
                                title: 'Create Profile',
                                desc: 'Sign up, complete your profile, and upload your CV.',
                            },
                            {
                                num: '02',
                                title: 'Discover',
                                desc: 'Browse curated internships matching your exact skills.',
                            },
                            {
                                num: '03',
                                title: 'Apply',
                                desc: 'Submit applications with a single click.',
                            },
                            {
                                num: '04',
                                title: 'Get Hired',
                                desc: 'Ace the interview and land your dream role.',
                            },
                        ].map((step, i) => (
                            <motion.div key={i} variants={fadeInUp} className="timeline-step">
                                <div className="step-number">{step.num}</div>
                                <h3
                                    style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section id="companies" className="section">
                <div className="container text-center">
                    <motion.p
                        initial={{
                            opacity: 0,
                        }}
                        whileInView={{
                            opacity: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        style={{
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontSize: '0.875rem',
                            marginBottom: '3rem',
                            fontWeight: 600,
                        }}
                    >
                        Trusted by Leading Innovative Companies
                    </motion.p>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                        }}
                        variants={staggerContainer}
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '3rem',
                            opacity: 0.5,
                            filter: 'grayscale(100%)',
                        }}
                    >
                        {['Acme Corp', 'GlobalTech', 'Innovate Inc', 'Nexus', 'Quantum'].map(
                            (company, i) => (
                                <motion.div
                                    key={i}
                                    variants={scaleUp}
                                    style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 800,
                                        letterSpacing: '-0.05em',
                                    }}
                                >
                                    {company}
                                </motion.div>
                            )
                        )}
                    </motion.div>
                </div>
            </section>

            <section
                className="section"
                style={{
                    paddingTop: '2rem',
                }}
            >
                <div className="container">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{
                            once: true,
                            margin: '-100px',
                        }}
                        variants={fadeInUp}
                        className="split-cta"
                    >
                        <div className="cta-half cta-student">
                            <div
                                style={{
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(99, 102, 241, 0.2)',
                                        borderRadius: '2rem',
                                        color: '#818cf8',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <FaUserGraduate /> For Students
                                </div>
                                <h2
                                    style={{
                                        fontSize: '2.5rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Ready to launch?
                                </h2>
                                <p
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '2rem',
                                        maxWidth: '400px',
                                    }}
                                >
                                    Join thousands of students who found their dream internship
                                    through CareerSync.
                                </p>
                                <a href="/register" className="btn btn-white">
                                    Create Student Account
                                </a>
                            </div>
                        </div>

                        <div className="cta-half cta-employer">
                            <div
                                style={{
                                    position: 'relative',
                                    zIndex: 2,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(139, 92, 246, 0.2)',
                                        borderRadius: '2rem',
                                        color: '#c084fc',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <FaBuilding /> For Employers
                                </div>
                                <h2
                                    style={{
                                        fontSize: '2.5rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    Hire top talent.
                                </h2>
                                <p
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '2rem',
                                        maxWidth: '400px',
                                    }}
                                >
                                    Connect with verified, ambitious university students ready to
                                    make an impact.
                                </p>
                                <a href="/register" className="btn btn-white">
                                    Register Company
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer
                style={{
                    background: '#020617',
                    padding: '4rem 1.5rem 2rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '3rem',
                            marginBottom: '4rem',
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    color: 'white',
                                    marginBottom: '1rem',
                                }}
                            >
                                <FaSyncAlt color="#6366f1" /> CareerSync
                            </div>
                            <p
                                style={{
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem',
                                    maxWidth: '250px',
                                }}
                            >
                                The modern platform connecting ambitious students with
                                industry-leading companies.
                            </p>
                        </div>

                        <div>
                            <h4
                                style={{
                                    color: 'white',
                                    marginBottom: '1.5rem',
                                    fontSize: '1rem',
                                }}
                            >
                                Platform
                            </h4>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                <li>
                                    <a
                                        href="#features"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#how-it-works"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        How it Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#companies"
                                        style={{
                                            color: 'var(--color-text-muted)',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        Companies
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4
                                style={{
                                    color: 'white',
                                    marginBottom: '1.5rem',
                                    fontSize: '1rem',
                                }}
                            >
                                Connect
                            </h4>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                }}
                            >
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    <FaTwitter />
                                </a>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    <FaLinkedin />
                                </a>
                                <a
                                    href="#"
                                    style={{
                                        color: 'var(--color-text-muted)',
                                        fontSize: '1.25rem',
                                    }}
                                >
                                    <FaGithub />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            paddingTop: '2rem',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: '0.875rem',
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            © 2026 CareerSync. Built for the next generation of professionals.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default HomePage