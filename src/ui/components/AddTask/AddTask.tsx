import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addTab } from '../../store/tabSlice'
import './AddTask.scss';

type FormData = {
  title: string;
  url: string;
};

export const AddTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const apiResponse = await window.API.createTask(data);

    const task = {
      key: apiResponse.key,
      data: apiResponse.data,
    };

    const newTab = {
      task, 
      isActive: true,
      input: '',
      isSwitchOn: false,
    };

    dispatch(addTab(newTab));
    navigate('/parsing-workspace', {state: { key: apiResponse.key }});
    reset();
  };

  const renderError = (fieldName: keyof FormData) => {
    const error = errors?.[fieldName];

    return error ? (
      <p className="error-text">
        {typeof error.message === 'string' ? error.message : 'Error!'}
      </p>
    ) : null;
  };

  return (
    <div className="task-create">
      <form onSubmit={handleSubmit(onSubmit)} className="task-create__form">
        <div className="task-create__item">
          <label htmlFor="taskTitle" className="task-create__label">Task Title:</label>

          <div>
            <input
              className="task-create__input"
              type="text"
              placeholder="Enter title"
              {...register('title', { required: 'This field is required' })}
              id="taskTitle"
            />

            {renderError('title')}
          </div>
        </div>

        <div className="task-create__item">
          <label htmlFor="taskUrl" className="task-create__label">URL Input</label>

          <div>
            <input
              className="task-create__input"
              type="text"
              placeholder="Enter URL"
              {...register('url', {
                required: 'This field is required',
                validate: {
                  isValidURL: (value) =>
                    /^(https?):\/\/[^\s/$.?#].[^\s]*$/.test(value) || 'Invalid URL format',
                },
              })}
              id="taskUrl"
            />

            {renderError('url')}
          </div>
        </div>

        <input 
          className="task-create__button button" 
          type="submit"
          value="Create Task"
          disabled={!isValid}
        />
      </form>
    </div>
  );
};