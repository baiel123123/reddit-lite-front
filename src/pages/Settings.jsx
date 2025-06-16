import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./styles/Settings.module.css";
import ActivateAccount from "../features/users/components/ActivateAccount";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showActivateModal, setShowActivateModal] = useState(false);

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    }
    navigate("/login");
  };

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.settingsTitle}>Настройки</h2>

      <div className={styles.section}>
        <h3 className={styles.sectionHeader}>Профиль</h3>
        <div className={styles.profileField}>
          <span className={styles.fieldLabel}>Email</span>
          <div className={styles.fieldValueWrapper}>
            <span className={styles.fieldValue}>
              {user?.email || "example@example.com"}
            </span>
            <button
              className={styles.arrowButton}
              onClick={() => navigate("/edit-profile")}
            >
              →
            </button>
          </div>
        </div>
        <div className={styles.profileField}>
          <span className={styles.fieldLabel}>Gender</span>
          <div className={styles.fieldValueWrapper}>
            <span className={styles.fieldValue}>
              {user?.gender || "Не указано"}
            </span>
            <button
              className={styles.arrowButton}
              onClick={() => navigate("/edit-profile")}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {!user?.is_activated && (
        <div className={styles.section}>
          <h3 className={styles.sectionHeader}>Активация аккаунта</h3>
          <div className={styles.accountField}>
            <span className={styles.fieldLabel}>Перейти к активации</span>
            <button
              className={styles.arrowButton}
              onClick={() => setShowActivateModal(true)}
            >
              →
            </button>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionHeader}>Аккаунт</h3>
        <div className={styles.accountField}>
          <span className={`${styles.fieldLabel} ${styles.redText}`}>Выйти</span>
          <button className={styles.arrowButton} onClick={handleLogout}>
            →
          </button>
        </div>
        <div className={styles.accountField}>
          <span className={`${styles.fieldLabel} ${styles.redText}`}>
            Удалить мой аккаунт
          </span>
          <button
            className={styles.arrowButton}
            onClick={() => navigate("/delete-account")}
          >
            →
          </button>
        </div>
      </div>

      {showActivateModal && (
        <ActivateAccount onClose={() => setShowActivateModal(false)} />
      )}
    </div>
  );
}
