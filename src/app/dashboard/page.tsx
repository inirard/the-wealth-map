
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Donut, ListChecks, BookOpen, Quote, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useI18n } from "@/hooks/use-i18n";

export default function DashboardPage() {
  const [name] = useLocalStorage("username", "Explorer");
  const { t } = useI18n();

  const featureCards = [
    {
      title: t("goals_mapping"),
      description: t("goals_mapping_desc"),
      icon: Target,
      href: "/dashboard/goals",
      color: "text-primary",
    },
    {
      title: t("wealth_wheel"),
      description: t("wealth_wheel_desc"),
      icon: Donut,
      href: "/dashboard/wealth-wheel",
      color: "text-accent",
    },
    {
      title: t("monthly_tracker"),
      description: t("monthly_tracker_desc"),
      icon: ListChecks,
      href: "/dashboard/tracker",
      color: "text-green-600",
    },
    {
      title: t("reflection"),
      description: t("reflection_desc"),
      icon: BookOpen,
      href: "/dashboard/reflection",
      color: "text-emphasis",
    },
    {
      title: t("affirmations"),
      description: t("affirmations_desc"),
      icon: Quote,
      href: "/dashboard/quotes",
      color: "text-secondary-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
              {t("welcome_user", { name })}
            </h1>
            <p className="mt-2 text-lg text-foreground/80">{t("dashboard_subtitle")}</p>
            <div className="mt-6">
              <Link href="/dashboard/goals">
                <Button size="lg" className="group">
                  {t("set_first_goal")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative w-full h-[300px] md:h-[400px]">
            <Image
              data-ai-hint="financial planning illustration"
              src="https://placehold.co/600x400.png"
              alt="Financial planning illustration"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">{t("your_toolkit")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={feature.href}>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground">
                    {t("open")}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
