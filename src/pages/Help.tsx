import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Book, MessageCircle, Mail } from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I get started with the API?",
      answer: "Getting started is easy! First, sign up for an account and generate your API key. Then check out our Getting Started guide for step-by-step instructions on making your first API call."
    },
    {
      question: "What are the rate limits for each plan?",
      answer: "Rate limits vary by plan: Free plan allows 1,000 requests per month, Pro plan allows 100,000 requests per month, and Enterprise plans have custom limits based on your needs."
    },
    {
      question: "How do I upgrade my plan?",
      answer: "You can upgrade your plan anytime from your account dashboard. Go to the Plans page, select your desired plan, and follow the checkout process. Changes take effect immediately."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal for subscription payments. Enterprise customers can also arrange for invoice billing."
    },
    {
      question: "How can I monitor my API usage?",
      answer: "Your dashboard provides real-time usage monitoring including request counts, response times, and error rates. You can also set up alerts to notify you when approaching limits."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes! Free plans include email support, Pro plans get priority support, and Enterprise customers receive 24/7 dedicated support with guaranteed response times."
    }
  ];

  const categories = [
    {
      title: "API Documentation",
      description: "Complete reference for all API endpoints",
      icon: Book,
      link: "/docs"
    },
    {
      title: "Getting Started",
      description: "Step-by-step setup and integration guide",
      icon: MessageCircle,
      link: "/getting-started"
    },
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: Mail,
      link: "/contact"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <Section padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Help Center
            </h1>
            <p className="text-muted-foreground">
              Find answers to common questions and get the help you need
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-api-secondary/10 rounded-lg flex items-center justify-center mb-2">
                      <Icon className="h-6 w-6 text-api-secondary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            {filteredFaqs.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible>
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No results found for "{searchQuery}". Try different keywords or{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setSearchQuery("")}>
                      clear your search
                    </Button>
                    .
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-12 text-center">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                <p className="text-muted-foreground mb-4">
                  Can't find what you're looking for? Our support team is ready to help.
                </p>
                <Button>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
};

export default Help;