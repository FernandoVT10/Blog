import { useRouter } from "next/router";

import "./Pagination.scss";

export default ({ pagination }) => {
    const router = useRouter();

    const handleOffset = (offset) => {
        const query = router.query;

        Object.assign(query, { offset });

        router.push({
            pathname: router.pathname,
            query
        })
    };

    const getLeftArrow = () => {
        if(pagination.hasPrevPage) {
            return (
                <a
                href="#"
                onClick={() => handleOffset(pagination.prevPage)}
                className="pagination__arrow">
                    <i className="fas fa-chevron-left" aria-hidden="true"></i>
                </a>
            );
        }

        return (
            <a href="#" className="pagination__arrow pagination__arrow--disabled">
                <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </a>
        );
    };

    const getRightArrow = () => {
        if(pagination.hasNextPage) {
            return (
                <a
                href="#"
                onClick={() => handleOffset(pagination.nextPage)}
                className="pagination__arrow">
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                </a>
            );
        }

        return (
            <a href="#" className="pagination__arrow pagination__arrow--disabled">
                <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </a>
        );
    };

    const getPages = () => {
        if(pagination.pages) {
            return pagination.pages.map(({ number, active }, index) => {
                const numberClass = active ? "pagination__number--active" : "";

                return (
                    <li className="pagination__number-item" key={index}>
                        <a 
                        href="#"
                        onClick={() => handleOffset(number)}
                        className={`pagination__number ${numberClass}`}>
                            { number }
                        </a>
                    </li>
                );
            });
        }
    }

    return (
        <div className="pagination">
            { getLeftArrow() }

            <ul className="pagination__number-container">
                { getPages() }
            </ul>

            { getRightArrow() }
        </div>
    );
};