import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import styles from "./cookies.module.css"
import tstyles from "../common/responsiveTable.module.css"

export default function CookieTable({cookies}) {
    const tabularizedCookies = cookies.map((cookie,index) => {
        return (
            <Tr key={"cookie"+index}>
                <Td>
                    {cookie.link !== null ?
                        <a href={cookie.link}>{cookie.name}</a> :
                        cookie.name
                    }
                </Td>
                <Td>{cookie.purpose}</Td>
                <Td>{cookie.party}</Td>
                <Td>{cookie.expiration}</Td>
            </Tr>
        );
    })

    return (
        <Table className={styles.CookieTable+" "+tstyles.responsiveTable}>
            <Thead>
                <Tr>
                    <Th>Pliki cookie</Th>
                    <Th>Zastosowanie</Th>
                    <Th>Stosowane pliki cookie</Th>
                    <Th>Okres przechowywania</Th>
                </Tr>
            </Thead>
            <Tbody>
                {tabularizedCookies}
            </Tbody>
        </Table>
    );
}