import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import Section from "@/components/layout/Section";
import { motion } from "framer-motion";
import AnimatedTextCycler from "@/components/AnimatedTextCycler";
import { Link } from "react-router-dom";

interface HeroStatProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const HeroStat = ({ icon: IconComponent, title, description }: HeroStatProps) => {
  return (
    <div className="text-center">
      <motion.div
        className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 backdrop-blur group-hover:bg-white/20 transition-colors duration-300"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 }
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className="h-8 w-8 text-white" />
        </motion.div>
      </motion.div>
      <motion.h3
        className="font-semibold text-white mb-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-blue-100 text-sm"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {description}
      </motion.p>
    </div>
  );
};

const Hero = () => {
  const { hero } = siteConfig;
  const AnnouncementIcon = hero.announcement.icon;
  
  const techTerms = [
    "Symbolic AI",
    "NP-Hard Solver",
    "Fast Factoring",
    "Non-Local Communication",
    "Quantum Semantics",
    "Resonance Network"
  ];

  return (
    <Section background="gradient" className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30 animate-gradient"
        animate={{
          background: [
            "linear-gradient(135deg, hsl(220 14% 10%), hsl(199 89% 48%))",
            "linear-gradient(135deg, hsl(199 89% 48%), hsl(142 71% 45%))",
            "linear-gradient(135deg, hsl(142 71% 45%), hsl(38 92% 50%))",
            "linear-gradient(135deg, hsl(38 92% 50%), hsl(220 14% 10%))"
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 bg-blue-400/20 rounded-lg rotate-45 animate-float"
        animate={{
          rotate: [45, 135, 45],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-12 h-12 bg-purple-400/15 rounded-full animate-float"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Additional floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Animated grid overlay */}
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-20"
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
            <AnnouncementIcon className="mr-2 h-4 w-4" />
            {hero.announcement.text}
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {hero.title}
        </motion.h1>

        {/* Animated Technology Terms */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-3xl md:text-4xl font-semibold mb-2">
            <AnimatedTextCycler
              texts={techTerms}
              interval={2500}
              className="text-3xl md:text-4xl font-semibold"
            />
          </div>
          <motion.div
            className="text-lg md:text-xl text-blue-200 opacity-80"
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              {hero.subtitle}
            </span>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {hero.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button size="lg" className="bg-white dark:bg-gray-100 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-3" asChild>
            <Link to={hero.cta.primary.href}>
              {hero.cta.primary.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/80 dark:border-white/60 text-white hover:bg-white/30 dark:hover:bg-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-sm px-8 py-3"
            asChild
          >
            <Link to={hero.cta.secondary.href}>
              {hero.cta.secondary.text}
            </Link>
          </Button>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {hero.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.2 + index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group"
            >
              <HeroStat {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </Section>
  );
};

export default Hero;