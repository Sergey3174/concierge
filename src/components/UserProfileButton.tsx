import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getUserAnimalIcon } from "../constants/animals";
import { selectUserInfo } from "../store/authUserSlice";

export function UserProfileButton() {
  const { t } = useTranslation();
  const userInfo = useSelector(selectUserInfo);
  const [userAnimal] = useState(getUserAnimalIcon);
  const UserAnimalIcon = userAnimal.icon;
  const telegramUsername = userInfo?.providers.telegram?.username?.trim();
  const email = userInfo?.providers.email?.subject?.trim();
  const telegramId = userInfo?.providers.telegram?.subject?.trim();
  const userLabel = telegramUsername || email;

  if (userLabel) {
    return (
      <button
        type="button"
        className="flex items-center gap-3 rounded-full px-2 py-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-accent-contrast)]">
          {userLabel[0].toUpperCase()}
        </div>
        <span className="max-w-40 truncate text-[1.05rem]">{userLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-full px-2 py-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${userAnimal.styleIcons}`}
      >
        <UserAnimalIcon size={24} />
      </div>
      <span className="max-w-40 truncate text-[1.05rem]">
        {telegramId ?? t(`animals.${userAnimal.key}`)}
      </span>
    </button>
  );
}
