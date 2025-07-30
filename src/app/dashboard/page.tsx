
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Target,
  Donut,
  ListChecks,
  BookOpen,
  Quote,
  ArrowRight,
} from "lucide-react";
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
    <div className="flex flex-col gap-10 font-sans">
      {/* Hero Section */}
      <Card className="rounded-2xl shadow-sm border bg-white">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-10">
            <h1 className="text-2xl font-semibold font-headline text-primary whitespace-nowrap overflow-hidden text-ellipsis">
              {t("welcome_user", { name })}
            </h1>
            <p className="mt-2 text-muted-foreground text-base">{t("dashboard_subtitle")}</p>
            <div className="mt-6">
              <Link href="/dashboard/goals">
                <Button size="lg" className="group hover:bg-primary/90 rounded-xl">
                  {t("set_first_goal")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-4">
            <Image
              src="https://placehold.co/400x300.png"
              alt="Financial planning illustration"
              data-ai-hint="financial planning illustration"
              width={400}
              height={300}
              className="w-full max-w-[400px] h-auto object-contain rounded-xl"
              priority
            />
          </div>
        </div>
      </Card>

      {/* Feature Cards */}
      <div>
        <h2 className="text-2xl font-semibold font-headline mb-4 text-foreground">
          {t("your_toolkit")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-2xl shadow-sm border bg-card hover:shadow-md transition-shadow flex flex-col"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link href={feature.href}>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl hover:bg-primary hover:text-white"
                  >
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
