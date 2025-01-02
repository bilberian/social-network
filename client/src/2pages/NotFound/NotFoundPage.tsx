import { Link } from 'react-router-dom';

function NotFoundPage(): React.JSX.Element {
  return (
    <div className='notFound'>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to='/'>Вернуться на главную</Link>
    </div>
  );
}

export default NotFoundPage;