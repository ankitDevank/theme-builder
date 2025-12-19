import { Role } from "@/lib/roles";

export type SectionType = "hero" | "card";

export interface BaseSection {
  id: string;
  type: SectionType;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  heading: string;
  subheading: string;
}

export interface CardSection extends BaseSection {
  type: "card";
  title: string;
  description: string;
}

export type Section =
  | {
      id: string;
      type: "hero";
      heading: string;
      subheading: string;
    }
  | {
      id: string;
      type: "card";
      title: string;
      description: string;
      button1Text: string;
      button1Link: string;
      button2Text: string;
      button2Link: string;
    };

export type PageConfig = {
  sections: Section[];
  layout: {
    cardsPerRow: number;
  };
};

type User = {
  id: string;
  name: string;
};

export type DashboardProps = {
  users: User[];
  initialUserId?: string | null;
  initialConfig?: PageConfig | null;
  currentUserRole?: Role | null;
};
