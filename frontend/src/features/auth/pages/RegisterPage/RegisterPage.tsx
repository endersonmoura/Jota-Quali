import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import {
  AuthLayout,
  authLayoutStyles as s,
} from "../../components/AuthLayout/AuthLayout";
import { Field } from "@/components/ui/Field/Field";
import { Button } from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert/Alert";
import { useAuth } from "../../hooks/useAuth";
import { isEmail, required } from "@/lib/validators";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/cn";
import styles from "./RegisterPage.module.css";

interface FormErrors {
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
  confirm?: string;
  terms?: string;
}

interface PasswordRules {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
}

function evaluatePassword(pwd: string): {
  rules: PasswordRules;
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
} {
  const rules: PasswordRules = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
  };
  const score = (Object.values(rules).filter(Boolean).length) as 0 | 1 | 2 | 3 | 4;
  const label =
    score === 0
      ? "—"
      : score === 1
      ? "Muito fraca"
      : score === 2
      ? "Fraca"
      : score === 3
      ? "Boa"
      : "Forte";
  return { rules, score, label };
}

export default function RegisterPage() {
  useDocumentTitle("Criar conta");
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const pwdInfo = useMemo(() => evaluatePassword(password), [password]);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!required(name)) next.name = "Informe seu nome completo.";
    else if (name.trim().length < 3) next.name = "Nome muito curto.";

    if (!required(email)) next.email = "Informe seu e-mail.";
    else if (!isEmail(email)) next.email = "E-mail inválido.";

    if (!required(cpf)) next.cpf = "Informe seu CPF.";
    else if (cpf.replace(/\D/g, "").length < 11) next.cpf = "CPF inválido.";


    if (!required(password)) next.password = "Crie uma senha.";
    else if (pwdInfo.score < 4)
      next.password = "A senha não atende a todos os requisitos.";

    if (!required(confirm)) next.confirm = "Confirme sua senha.";
    else if (confirm !== password) next.confirm = "As senhas não coincidem.";

    if (!acceptTerms) next.terms = "Você precisa aceitar os termos.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name, email, cpf, password });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.login, { replace: true }), 2000);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Não foi possível criar sua conta."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Conta criada com sucesso"
        subtitle="Aguarde o redirecionamento."
      >
        <div className={s.form}>
          <Alert variant="success" title="Bem-vindo(a) ao JotaQuali">
            Sua conta foi criada com sucesso! Você será redirecionado para a tela de login em instantes.
          </Alert>
        </div>
      </AuthLayout>
    );
  }

  const checks: { key: keyof PasswordRules; label: string }[] = [
    { key: "length", label: "Mínimo de 8 caracteres" },
    { key: "upper", label: "Uma letra maiúscula" },
    { key: "lower", label: "Uma letra minúscula" },
    { key: "number", label: "Um número" },
  ];

  return (
    <AuthLayout
      title="Criar nova conta"
      subtitle="Cadastre-se para acessar a plataforma JotaQuali."
    >
      <form className={s.form} onSubmit={onSubmit} noValidate>
        {formError && (
          <Alert variant="danger" title="Não foi possível cadastrar">
            {formError}
          </Alert>
        )}

        <Field
          label="Nome completo"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
          autoFocus
        />

        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu.nome@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Field
          label="CPF"
          type="text"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          error={errors.cpf}
          required
        />


        <div className={styles.grid2}>
          <Field
            label="Senha"
            type={showPwd ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            rightAdornment={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  all: "unset",
                  display: "inline-flex",
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Field
            label="Confirmar senha"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            required
            rightAdornment={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={
                  showConfirm ? "Ocultar confirmação" : "Mostrar confirmação"
                }
                style={{
                  all: "unset",
                  display: "inline-flex",
                  padding: 6,
                  cursor: "pointer",
                }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
        </div>

        {password.length > 0 && (
          <div className={styles.strength} aria-live="polite">
            <div className={styles.strengthBars}>
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={cn(
                    styles.bar,
                    pwdInfo.score >= i && styles[`lvl${pwdInfo.score}` as const]
                  )}
                />
              ))}
            </div>
            <div className={styles.strengthMeta}>
              <span>Força da senha</span>
              <span className={styles.strengthLabel}>{pwdInfo.label}</span>
            </div>
            <ul className={styles.checks}>
              {checks.map((c) => {
                const ok = pwdInfo.rules[c.key];
                return (
                  <li
                    key={c.key}
                    className={cn(styles.check, ok && styles.checkOn)}
                  >
                    <span className={styles.dot} />
                    {c.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <label className={styles.terms}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => {
              setAcceptTerms(e.target.checked);
              if (e.target.checked) {
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }
            }}
          />
          <span>
            Li e concordo com os <a href="#">Termos de Uso</a> e a{" "}
            <a href="#">Política de Privacidade</a> da JotaQuali.
          </span>
        </label>
        {errors.terms && <span className={styles.termsError}>{errors.terms}</span>}

        <Button type="submit" fullWidth size="lg" loading={submitting}>
          Criar conta
        </Button>

        <p className={styles.signinHint}>
          Já possui acesso?{" "}
          <Link to={ROUTES.login} className={s.linkBtn}>
            Fazer login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
