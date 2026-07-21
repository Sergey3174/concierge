import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getUserAnimalIcon } from "../constants/animals";
import { fetchUserInfo } from "../store/authUserSlice";
import type { AppDispatch, RootState } from "../store/store";

export function UserProfileButton() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const sessionType = useSelector(
    (state: RootState) => state.authUser.sessionType,
  );
  const [email, setEmail] = useState<string | null>(null);
  const [userAnimal] = useState(getUserAnimalIcon);
  const UserAnimalIcon = userAnimal.icon;

  useEffect(() => {
    if (sessionType !== "authenticated") {
      return;
    }

    void dispatch(fetchUserInfo())
      .unwrap()
      .then((userInfo) => setEmail(userInfo.providers.email?.subject ?? null))
      .catch(() => setEmail(null));
  }, [dispatch, sessionType]);

  const userEmail = sessionType === "authenticated" ? email : null;

  if (userEmail) {
    return (
      <button
        type="button"
        className="flex items-center gap-3 rounded-full px-2 py-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-soft)]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-accent-contrast)]">
          {userEmail[0].toUpperCase()}
        </div>
        <span className="max-w-40 truncate text-[1.05rem]">{userEmail}</span>
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
      <span className="text-[1.05rem]">{t(`animals.${userAnimal.key}`)}</span>
    </button>
  );
}
