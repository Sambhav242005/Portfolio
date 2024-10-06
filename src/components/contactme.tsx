import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ContactMe̥({className}:{className?:string}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the form data to a server
        console.log('Form submitted:', { name, email, message })
        // Reset form fields
        setName('')
        setEmail('')
        setMessage('')
    }
    return (
        <>
            <Card className={cn(className)}>
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Fill out the form and I{'&aposl'}l get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                placeholder="Your Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Textarea
                                placeholder="Your Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <Send className="mr-2 h-4 w-4" /> Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}