
"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import styles from "./Packages.module.scss";
import { FaCheck } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { getAllPackages } from "@/services/api";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function Packages() {
  const t = useTranslations("Home");
  const router = useRouter();
  const tPackages = useTranslations("packages");
  const userInfo = useUserStore((state) => state.info);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);

        const response = await getAllPackages();

        const plans = response?.data;

        setPackages(
          [...plans].sort(
            (a, b) => a.sort_order - b.sort_order
          )
        );
      } catch (error) {
        console.error("Error fetching packages:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageSelect = (plan) => {
    if (!userInfo) {
      router.push("/auth/login");
      return;
    }
  };

  return (
    <div className={styles.section} id="5">
      <p className={styles.title}>
        {t("pricingTitle")}
      </p>

      <h1 className={styles.desc}>
        {t("pricingHeadline")}
      </h1>

      {loading ? (
        <p>{tPackages("loading")}</p>
      ) : error ? (
        <p>{tPackages("noPackagesFound")}</p>
      ) : (
        <div className={styles.packages}>
          {packages.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.package} ${
                !plan.is_featured ? styles.normal : ""
              }`}
            >
              <h1>{plan.name}</h1>

              <h3>
                <span>
                  {plan.is_free
                    ? t("free")
                    : plan.price}
                </span>{" "}
                {!plan.is_free && plan.currency}
              </h3>

              <Button outline={!plan.is_featured} onClick={() => {
                handlePackageSelect(plan);
              }}>
                {plan.is_featured
                  ? t("premiumButton")
                  : t("basicButton")}
              </Button>

              <h4>{t("basicIncludes")}</h4>

              <div className={styles.list}>
                {[...(plan.features || [])]
                  .sort(
                    (a, b) =>
                      a.sort_order - b.sort_order
                  )
                  .map((feature) => (
                    <p key={feature.id}>
                      <FaCheck />
                      {feature.feature_text}
                    </p>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
