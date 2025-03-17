"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";

const API_URL = "https://restcountries.com/v3.1/all";

function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Sort countries by name
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCountrySelection = (country) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      }
      return prev.length < 2 ? [...prev, country] : prev;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Country List</h1>
      <input
        type="text"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchBar}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Flag</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Capital</th>
            <th className={styles.tableHeader}>Population</th>
            <th className={styles.tableHeader}>Area</th>
            <th className={styles.tableHeader}>Select</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country) => (
            <tr key={country.cca3} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <img
                  src={country.flags?.png}
                  alt={country.name.common}
                  className={styles.flag}
                />
              </td>
              <td className={styles.tableCell}>
                <Link
                  href={`/country/${country.cca3}`}
                  className={styles.link}
                >
                  {country.name.common}
                </Link>
              </td>
              <td className={styles.tableCell}>
                {country.capital ? country.capital[0] : "N/A"}
              </td>
              <td className={styles.tableCell}>
                {country.population.toLocaleString()}
              </td>
              <td className={styles.tableCell}>
                {country.area.toLocaleString()} km²
              </td>
              <td className={styles.tableCell}>
                <button
                  onClick={() => toggleCountrySelection(country)}
                  className={
                    selectedCountries.includes(country)
                      ? styles.selectedButton
                      : styles.button
                  }
                >
                  {selectedCountries.includes(country) ? "Deselect" : "Select"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCountries.length === 2 && (
        <div className={styles.comparisonContainer}>
          <h2 className={styles.comparisonTitle}>Comparison</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Attribute</th>
                <th className={styles.tableHeader}>{selectedCountries[0].name.common}</th>
                <th className={styles.tableHeader}>{selectedCountries[1].name.common}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tableCell}>Population</td>
                <td className={styles.tableCell}>
                  {selectedCountries[0].population.toLocaleString()}
                </td>
                <td className={styles.tableCell}>
                  {selectedCountries[1].population.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className={styles.tableCell}>Area</td>
                <td className={styles.tableCell}>
                  {selectedCountries[0].area.toLocaleString()} km²
                </td>
                <td className={styles.tableCell}>
                  {selectedCountries[1].area.toLocaleString()} km²
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
