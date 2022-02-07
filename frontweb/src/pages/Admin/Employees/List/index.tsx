import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from 'util/auth';

type SubcomponentState = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [subcomponentState, setSubcomponentState] = useState<SubcomponentState>(
    {
      activePage: 0,
    }
  );

  const getProducts = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: subcomponentState.activePage,
        size: 4,
      },
    };
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [subcomponentState]);

  useEffect(getProducts, [getProducts]);

  const handlePageChange = (pageNumber: number) => {
    setSubcomponentState({
      activePage: pageNumber,
    });
  };

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      )}

      <div className="row">
        {page &&
          page.content.map((employee) => (
            <div className="col-sm-6 col-md-12" key={employee.id}>
              <EmployeeCard employee={employee} />
            </div>
          ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
