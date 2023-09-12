import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import tstyles from '../../common/responsiveTable.module.css'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import styles from "./download.module.css"

const DownloadItem = ({links}) => {
    //transform links into iteratable object
    if(!Array.isArray(links)) links = Object.keys(links).map((key) => links[key]);

    let truncate = (originalString, maxLength) => {
        let finalLength = Math.min(maxLength, originalString.length);
        let ellipsis = finalLength !== originalString.length ? "..." : "";
        return originalString.substring(0, finalLength) + ellipsis;
    }

    return (
        <Table className={tstyles.responsiveTable+" "+styles.responsiveTable}>
            <Tbody>
                {links && links.map((link,index) => {
                        return (
                                <Tr key={`${link.name}-${index}`}>
                                    <Td className={styles.tableColumn}>
                                        <b>{link.name}</b>
                                    </Td>
                                    <Td className={styles.tableColumn}>
                                        <a href={link.link} className='LinkItemLink' download>
                                            {truncate(link.link,100)}
                                        </a>
                                    </Td>
                                </Tr>
                        )
                    }
                )}
            </Tbody>
        </Table>
    );
}


export default DownloadItem;