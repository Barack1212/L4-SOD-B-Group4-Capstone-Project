import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { RecommendationForm } from "@/components/recommendation-form";
import { FeatureCards } from "@/components/feature-cards";
import { PopularCrops } from "@/components/popular-crops";
import { FarmingTips } from "@/components/farming-tips";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <motion.main
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <motion.div variants={itemVariants}><Hero /></motion.div>
        <motion.div variants={itemVariants}><RecommendationForm /></motion.div>
        <motion.div variants={itemVariants}><FeatureCards /></motion.div>
        <motion.div variants={itemVariants}><PopularCrops /></motion.div>
        <motion.div variants={itemVariants}><FarmingTips limit={3} /></motion.div>
      </motion.main>
      <SiteFooter />
    </div>
  );
}
