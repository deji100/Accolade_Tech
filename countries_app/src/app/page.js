"use client";

import { useQuery, gql } from "@apollo/client";
import { useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      capital
      population
      area
      gdp
      cca3
      flag
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_COUNTRIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [country1, setCountry1] = useState(null);
  const [country2, setCountry2] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Loading and Error States
  if (loading)
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading country data...</p>
      </div>
    );

  if (error)
    return (
      <div className={styles.errorContainer}>
        <p>Error: {error.message}</p>
        <p>Please try again later.</p>
      </div>
    );

  // Sort countries alphabetically
  const sortedCountries = [...data.countries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Filter countries based on search input
  const filteredCountries = sortedCountries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (country.capital && country.capital[0]?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Country List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by country or capital..."
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1); // Reset to page 1 when searching
        }}
      />

      {/* Country Comparison Section */}
      <h2 className={styles.subtitle}>Compare Two Countries</h2>
      <div className={styles.compareSection}>
        <select className={styles.dropdown} onChange={(e) => setCountry1(data.countries.find(c => c.cca3 === e.target.value))}>
          <option value="">Select Country 1</option>
          {sortedCountries.map((country) => (
            <option key={country.cca3} value={country.cca3}>{country.name}</option>
          ))}
        </select>

        <select className={styles.dropdown} onChange={(e) => setCountry2(data.countries.find(c => c.cca3 === e.target.value))}>
          <option value="">Select Country 2</option>
          {sortedCountries.map((country) => (
            <option key={country.cca3} value={country.cca3}>{country.name}</option>
          ))}
        </select>
      </div>

      {country1 && country2 && (
        <div className={styles.comparisonTable}>
          <table>
            <thead>
              <tr>
                <th>Attribute</th>
                <th>{country1.name}</th>
                <th>{country2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Capital</td>
                <td>{country1.capital[0].toLocaleString()}</td>
                <td>{country2.capital[0].toLocaleString()}</td>
              </tr>
              <tr>
                <td>Population</td>
                <td>{country1.population.toLocaleString()}</td>
                <td>{country2.population.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Area (km²)</td>
                <td>{country1.area.toLocaleString()}</td>
                <td>{country2.area.toLocaleString()}</td>
              </tr>
              <tr>
                <td>GDP ($USD)</td>
                <td>{country1.gdp ? country1.gdp.toLocaleString() : "N/A"}</td>
                <td>{country2.gdp ? country2.gdp.toLocaleString() : "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Country List */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Flag</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Capital</th>
            <th className={styles.tableHeader}>Population</th>
            <th className={styles.tableHeader}>Area</th>
          </tr>
        </thead>
        <tbody>
          {currentCountries.length > 0 ? (
            currentCountries.map((country) => (
              <tr key={country.cca3} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <img src={country.flag} alt={country.name} className={styles.flag} />
                </td>
                <td className={styles.tableCell}>
                  <Link href={`/country/${country.cca3}`} className={styles.link}>
                    {country.name}
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={styles.noResults}>
                No countries found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
