import {
  Bird,
  Bug,
  Cat,
  Dog,
  Fish,
  Rabbit,
  Rat,
  Snail,
  Squirrel,
  Turtle,
} from "lucide-react";

export const animalIcons = [
  { key: "cat", icon: Cat, styleIcons: "bg-orange-100 text-orange-600" },
  { key: "dog", icon: Dog, styleIcons: "bg-amber-100 text-amber-700" },
  { key: "bird", icon: Bird, styleIcons: "bg-sky-100 text-sky-600" },
  { key: "rabbit", icon: Rabbit, styleIcons: "bg-pink-100 text-pink-600" },
  { key: "fish", icon: Fish, styleIcons: "bg-cyan-100 text-cyan-600" },
  {
    key: "turtle",
    icon: Turtle,
    styleIcons: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "squirrel",
    icon: Squirrel,
    styleIcons: "bg-yellow-100 text-yellow-700",
  },
  { key: "rat", icon: Rat, styleIcons: "bg-slate-100 text-slate-600" },
  { key: "snail", icon: Snail, styleIcons: "bg-lime-100 text-lime-700" },
  { key: "bug", icon: Bug, styleIcons: "bg-violet-100 text-violet-600" },
] as const;

const USER_ANIMAL_ICON_STORAGE_KEY = "concierge.user-animal-icon";

export function getUserAnimalIcon() {
  const savedKey = window.localStorage.getItem(USER_ANIMAL_ICON_STORAGE_KEY);
  const savedAnimal = animalIcons.find(({ key }) => key === savedKey);

  if (savedAnimal) {
    return savedAnimal;
  }

  const randomAnimal =
    animalIcons[Math.floor(Math.random() * animalIcons.length)];
  window.localStorage.setItem(USER_ANIMAL_ICON_STORAGE_KEY, randomAnimal.key);

  return randomAnimal;
}
