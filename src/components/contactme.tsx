'use client'
import React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Form schema
const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactForm({ className }: { className?: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const [isSent, setIsSent] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/contactme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      toast({
        title: "Success!",
        description: "Your message has been sent successfully.",
        duration: 5000,
      })

      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
      }, 5000);

      form.reset()
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={cn(className, "")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel className="text-base">Name</FormLabel>
                <FormControl>
                  <Input
                    className="text-sm p-3 bg-background/50 border-white/10 dark:border-white/5 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all duration-300"
                    placeholder="Enter your name"
                    {...field} required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel className="text-base">Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-sm p-3 bg-background/50 border-white/10 dark:border-white/5 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all duration-300"
                    placeholder="Enter your email" type="email" {...field} required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full text-left">
                <FormLabel className="text-base">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your message here"
                    className="min-h-[100px] text-sm p-3 bg-background/50 border-white/10 dark:border-white/5 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 transition-all duration-300 resize-none"
                    {...field} required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={cn("w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 shadow-md glow-hover", isSent && "bg-green-600 hover:bg-green-700")}
            disabled={form.formState.isSubmitting || isSent}
          >
            {isSent ? "Message Sent!" : (form.formState.isSubmitting ? "Sending..." : "Send Message")}
          </Button>
        </form>
      </Form>
    </div>
  )
}