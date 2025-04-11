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
              Get started with Quantum Courier today and experience the future of delivery.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/book" className="flex items-center gap-2">
                Book Your Parcel <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
