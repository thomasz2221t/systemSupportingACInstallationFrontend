import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import AuthService from "services/auth/AuthService";
import "./LoginWindow.scss";
import { UserRoles } from "utils/UserRoles";

export const defaultTypeData = {
  login: "",
  password: "",
  loading: false,
  message: "",
};

function LoginWindow() {
  const [data, setData] = useState(defaultTypeData);
  const [, setIsTypeRequestSent] = useState<boolean>(false);
  const navigate = useNavigate();
  //let location = useLocation();

  /*useEffect(() => {
    setState(AuthService.checkIfUserLogged());
  }, []);

  useEffect(() => {
    console.log(state.redirect);
    if (state.redirect) {
      navigate(`${state.redirect}`);
    }
  }, []);*/

  async function handleUpdateData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(data.login);
    console.log(data.password);
    setIsTypeRequestSent(true);

    AuthService.login(data.login, data.password).then(
      () => {
        console.log("link");
        console.log(AuthService.getCurrentUser());
        //<Link to="/obiekty" />;
        //<Redirect to="/obiekty" />;
        //props.history.push("/obiekty");
        //<Navigate to="/obiekty" state={{ from: location }} />;
        if (AuthService.getCurrentUserRoles()) {
          switch (AuthService.getCurrentUserRoles()[0]) {
            case UserRoles.ADMIN:
              navigate("/obiekty");
              break;
            case UserRoles.OPERATOR:
              navigate("/obiekty");
              break;
            case UserRoles.CLIENT:
              navigate("/obiekty");
              break;
          }
        } else {
          console.log("no permission to log");
        }
      }
      /*(error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setData({
          login: data.login,
          password: data.password,
          loading: false,
          message: resMessage,
        });
      }*/
    );
  }

  return (
    <>
      <div className="login-panel">
        <div className="log-in-label">
          <p>Zaloguj si??</p>
        </div>
        <form
          id="login-form"
          className="login-form-class"
          onSubmit={handleUpdateData}
        >
          <div>
            <Icon
              className="login-icon"
              icon="mdi:user-circle-outline"
              color="#4e4e4e"
              height="32"
            />
            <input
              className="login-input"
              type="text"
              placeholder="login"
              onChange={(e) =>
                setData({
                  ...data,
                  login: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Icon
              className="password-icon"
              icon="material-symbols:key-outline-rounded"
              color="#4e4e4e"
              height="32"
            />
            <input
              className="password-input"
              type="password"
              placeholder="has??o"
              onChange={(e) =>
                setData({
                  ...data,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div>
            <button className="log-in-button" type="submit">
              Zaloguj
            </button>
          </div>
          <div className="create-account-link">
            <p>Nie masz konta? Zarejestruj si??</p>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginWindow;
