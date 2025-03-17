"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";

export default function CountryPage() {
  const pathname = usePathname();
  const countryCode = pathname.split("/").pop();

  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode) return;

    const fetchCountry = async () => {
      try {
        const apiUrl = countryCode.length === 3
          ? `https://restcountries.com/v3.1/alpha/${countryCode}`
          : `https://restcountries.com/v3.1/name/${countryCode}?fullText=true`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!res.ok || data.status === 404) throw new Error("Country not found");

        setCountryData(data[0]); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryCode]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{countryData.name.common}</h1>
      <img src={countryData.flags.png} alt={countryData.name.common} className={styles.flag} />

      <table className={styles.table}>
        <tbody>
          <tr>
            <td className={styles.label}>Capital</td>
            <td>{countryData.capital ? countryData.capital[0] : "N/A"}</td>
          </tr>
          <tr>
            <td className={styles.label}>Population</td>
            <td>{countryData.population.toLocaleString()}</td>
          </tr>
          <tr>
            <td className={styles.label}>Area</td>
            <td>{countryData.area.toLocaleString()} km²</td>
          </tr>
          <tr>
            <td className={styles.label}>Region</td>
            <td>{countryData.region}</td>
          </tr>
          <tr>
            <td className={styles.label}>Subregion</td>
            <td>{countryData.subregion}</td>
          </tr>
          <tr>
            <td className={styles.label}>Languages</td>
            <td>{Object.values(countryData.languages || {}).join(", ")}</td>
          </tr>
          <tr>
            <td className={styles.label}>Currency</td>
            <td>
              {Object.values(countryData.currencies || {})
                .map((cur) => `${cur.name} (${cur.symbol})`)
                .join(", ")}
            </td>
          </tr>
        </tbody>
      </table>

      <Link href="/" className={styles.backLink}>← Back to Country List</Link>
    </div>
  );
}
