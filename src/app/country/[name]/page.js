// "use client";

// import { useQuery, gql } from "@apollo/client";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import styles from "./styles.module.css";

// const GET_COUNTRY = gql`
//   query GetCountry($code: String!) {
//     country(code: $code) {
//       name
//       capital
//       population
//       area
//       cca3
//       flag
//     }
//   }
// `;

// export default function CountryPage() {
//     const pathname = usePathname();
//     const countryCode = pathname.split("/").pop(); // Extract country code

//     const { loading, error, data } = useQuery(GET_COUNTRY, {
//         variables: { code: countryCode },
//         skip: !countryCode, // Skip query if no country code is found
//     });

//     if (loading)
//         return (
//             <div className={styles.loading}>
//                 <div className={styles.loader}></div>
//                 <p>Loading country data...</p>
//             </div>
//         );
        
//     if (error) return <p className={styles.error}>Error: {error.message}</p>;

//     const countryData = data.country;

//     return (
//         <div className={styles.container}>
//             <h1 className={styles.title}>{countryData.name}</h1>
//             <img src={countryData.flag} alt={countryData.name} className={styles.flag} />

//             <table className={styles.table}>
//                 <tbody>
//                     <tr>
//                         <td className={styles.label}>Capital</td>
//                         <td>{countryData.capital ? countryData.capital[0] : "N/A"}</td>
//                     </tr>
//                     <tr>
//                         <td className={styles.label}>Population</td>
//                         <td>{countryData.population.toLocaleString()}</td>
//                     </tr>
//                     <tr>
//                         <td className={styles.label}>Area</td>
//                         <td>{countryData.area.toLocaleString()} km²</td>
//                     </tr>
//                 </tbody>
//             </table>

//             <Link href="/" className={styles.backLink}>← Back to Country List</Link>
//         </div>
//     );
// }


"use client";

import { useQuery, gql } from "@apollo/client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";

const GET_COUNTRY = gql`
  query GetCountry($code: String!) {
    country(code: $code) {
      name
      capital
      population
      area
      cca3
      flag
    }
  }
`;

export default function CountryPage() {
    const pathname = usePathname();
    const countryCode = pathname.split("/").pop(); // Extract country code

    const { loading, error, data, refetch } = useQuery(GET_COUNTRY, {
        variables: { code: countryCode },
        skip: !countryCode, // Skip query if no country code is found
    });

    if (loading)
        return (
            <div className={styles.loading}>
                <div className={styles.loader}></div>
                <p>Loading country data...</p>
            </div>
        );

    if (error)
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>⚠️ Error: {error.message}</p>
                <button className={styles.retryButton} onClick={() => refetch()}>
                    Retry
                </button>
                <Link href="/" className={styles.backLink}>← Back to Country List</Link>
            </div>
        );

    if (!data?.country) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>⚠️ Country data not found.</p>
                <Link href="/" className={styles.backLink}>← Back to Country List</Link>
            </div>
        );
    }

    const countryData = data.country;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{countryData.name}</h1>
            <img src={countryData.flag} alt={countryData.name} className={styles.flag} />

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
                </tbody>
            </table>

            <Link href="/" className={styles.backLink}>← Back to Country List</Link>
        </div>
    );
}
