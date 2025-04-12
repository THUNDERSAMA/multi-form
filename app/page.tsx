// "use client"
// import MultiStepForm from "@/components/multi-step-form"

// export default function Home() {
//   return (
//     <main className="container mx-auto px-4 py-8 max-w-5xl">
      
//       <MultiStepForm />
//     </main>
//   )
// }

"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Rocket, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from 'next/image'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 500

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(124, 58, 237, ${Math.random() * 0.5 + 0.25})`,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width) particle.x = 0
        if (particle.x < 0) particle.x = canvas.width
        if (particle.y > canvas.height) particle.y = 0
        if (particle.y < 0) particle.y = canvas.height
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = 500
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="relative h-[500px] w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              The Future of <span className="text-primary">Delivery</span> is Here
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Lightning-fast courier services with real-time tracking and competitive rates. Experience the next
              generation of parcel delivery.
            </p>
            <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:justify-center">
              <Button asChild size="lg">
                <Link href="/book">Book a Delivery</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/track">Track Your Parcel</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <section className="container py-16 md:py-24">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Rocket className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Express Delivery</CardTitle>
                  <CardDescription>Same-day and next-day options</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our fastest service guarantees your package arrives on time, every time. Perfect for urgent documents
                  and time-sensitive items.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Global Shipping</CardTitle>
                  <CardDescription>Worldwide delivery network</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Send packages to over 200 countries with our reliable international shipping service. Competitive
                  rates and fast customs clearance.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Secure Handling</CardTitle>
                  <CardDescription>For valuable and fragile items</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Special care for delicate, valuable, or sensitive items. Extra padding, secure packaging, and
                  insurance options available.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Ship?</h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Get started with courierWallah today and experience the future of delivery.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/book" className="flex items-center gap-2">
                Book Your Parcel <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
    <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <h2 className="mb-8 lg:mb-16 text-3xl font-extrabold tracking-tight leading-tight text-center text-gray-900 dark:text-white md:text-4xl">You name it and we work with them</h2>
        <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
            <a href="#" className="flex justify-center items-center">
            <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/dtdc.jpeg"
        width={500}
        height={500}
        alt="Picture of the courier"
      />                     
            </a>
            <a href="#" className="flex justify-center items-center">
            <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/Delhivery.jpg"
        width={500}
        height={500}
        alt="Picture of the courier"
      />                                                    
            </a>
            <a href="#" className="flex justify-center items-center">
            <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/xpressbees.png"
        width={500}
        height={500}
        alt="Picture of the courier"
      />                                                                      
            </a>

            <a href="#" className="flex justify-center items-center">
            <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/bluedart.png"
        width={500}
        height={500}
        alt="Picture of the courier"
      />                                                                                         
            </a>
            <a href="#" className="flex justify-center items-center">
            {/* <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/fedex.png"
        width={500}
        height={500}
        alt="Picture of the courier"
      />               
                                                                            */}
                                                                            <svg className="h-9 hover:text-gray-900 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg"  viewBox="10 45.67 160.003 44.33"><path d="M169.018 84.244c0-2.465-1.748-4.27-4.156-4.27-2.404 0-4.154 1.805-4.154 4.27 0 2.461 1.75 4.263 4.154 4.263 2.408 0 4.156-1.805 4.156-4.263zm-5.248.219v2.789h-.901v-6.15h2.239c1.312 0 1.914.573 1.914 1.69 0 .688-.465 1.233-1.064 1.312v.026c.52.083.711.547.818 1.396.082.55.191 1.504.387 1.728h-1.066c-.248-.578-.223-1.396-.414-2.081-.158-.521-.436-.711-1.033-.711h-.875v.003l-.005-.002zm1.117-.795c.875 0 1.125-.466 1.125-.877 0-.486-.25-.87-1.125-.87h-1.117v1.749h1.117v-.002zm-5.17.576c0-3.037 2.411-5.09 5.141-5.09 2.738 0 5.146 2.053 5.146 5.09 0 3.031-2.407 5.086-5.146 5.086-2.73 0-5.141-2.055-5.141-5.086z" fill="#ff5a00"/><g fill="#ff5a00"><path d="M141.9 88.443l-5.927-6.647-5.875 6.647h-12.362l12.082-13.574-12.082-13.578h12.748l5.987 6.596 5.761-6.596h12.302l-12.022 13.521 12.189 13.631zM93.998 88.443V45.67h23.738v9.534h-13.683v6.087h13.683v9.174h-13.683v8.42h13.683v9.558z"/></g><path d="M83.98 45.67v17.505h-.111c-2.217-2.548-4.988-3.436-8.201-3.436-6.584 0-11.544 4.479-13.285 10.396-1.986-6.521-7.107-10.518-14.699-10.518-6.167 0-11.035 2.767-13.578 7.277V61.29H21.361v-6.085h13.91v-9.533H10v42.771h11.361V70.465h11.324a17.082 17.082 0 0 0-.519 4.229c0 8.918 6.815 15.185 15.516 15.185 7.314 0 12.138-3.437 14.687-9.694h-9.737c-1.316 1.883-2.316 2.439-4.949 2.439-3.052 0-5.686-2.664-5.686-5.818h19.826C62.683 83.891 68.203 90 75.779 90c3.268 0 6.26-1.607 8.089-4.322h.11v2.771h10.017V45.672H83.98v-.002zM42.313 70.593c.633-2.718 2.74-4.494 5.37-4.494 2.896 0 4.896 1.721 5.421 4.494H42.313zm35.588 11.341c-3.691 0-5.985-3.439-5.985-7.031 0-3.84 1.996-7.529 5.985-7.529 4.139 0 5.788 3.691 5.788 7.529 0 3.638-1.746 7.031-5.788 7.031z" fill="#29007c"/></svg>
            </a>
            <a href="#" className="flex justify-center items-center">
            {/* <Image
            className="h-9 hover:text-gray-900 dark:hover:text-white"
        src="/dhl.jpg"
        width={500}
        height={500}
        alt="Picture of the courier"
      />                                                                                       */}
      <svg className="h-9 hover:text-gray-900 dark:hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 35"><path fill="#ffcb01" d="M0 0h46.986v29.979H0z"/><g fill="#d80613"><path d="M8.731 11.413L7.276 13.39h7.93c.401 0 .396.151.2.418-.199.27-.532.737-.735 1.012-.103.139-.289.392.327.392h3.243l.961-1.306c.596-.809.052-2.492-2.079-2.492l-8.392-.001z"/><path d="M6.687 17.854l2.923-3.972h3.627c.401 0 .396.152.2.418l-.74 1.008c-.103.139-.289.392.327.392h4.858c-.403.554-1.715 2.154-4.067 2.154H6.687zM23.425 15.699l-1.585 2.155h-4.181l1.585-2.155zM29.829 15.211H19.604l2.796-3.798h4.179l-1.602 2.178h1.865l1.604-2.178h4.179zM29.47 15.699l-1.585 2.155h-4.179l1.585-2.155zM.722 16.549H6.88l-.336.457H.722zM.722 15.699h6.784l-.337.457H.722zM.722 17.399h5.533l-.335.455H.722zM46.265 17.006h-6.136l.337-.457h5.799zM46.265 17.854h-6.759l.334-.455h6.425zM41.091 15.699h5.174v.458h-5.51zM38.413 11.413l-2.796 3.798h-4.429l2.798-3.798zM30.83 15.699s-.305.418-.454.618c-.524.71-.061 1.536 1.652 1.536h6.712l1.585-2.154H30.83z"/></g></svg>
            </a>
        </div>
    </div>
</section>
    </div>
  )
}
