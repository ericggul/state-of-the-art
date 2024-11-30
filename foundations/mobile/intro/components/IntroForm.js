import AnimatedTitle from "./AnimatedTitle";
import * as S from "@/foundations/mobile/intro/styles";

export default function IntroForm({ nameInputProps }) {
  return (
    <S.IntroForm onSubmit={nameInputProps.handleUsernameSubmit}>
      <AnimatedTitle text="State-of-the-Art Gallery" />
      <div style={{ width: "90%" }}>
        <S.IntroInput
          type="text"
          placeholder="Enter your first name"
          value={nameInputProps.username}
          onChange={nameInputProps.handleUsernameChange}
          onBlur={nameInputProps.handleBlur}
          onKeyPress={nameInputProps.handleKeyPress}
          required
          maxLength={20}
          aria-invalid={!!nameInputProps.error}
          disabled={nameInputProps.isVerifying}
          autoComplete="off"
          enterKeyHint="done"
        />
        {nameInputProps.error && (
          <S.ErrorMessage>{nameInputProps.error}</S.ErrorMessage>
        )}
      </div>
      <S.IntroButton
        type="submit"
        disabled={
          !nameInputProps.username.trim() ||
          !!nameInputProps.error ||
          nameInputProps.isVerifying
        }
        style={{ width: "90%" }}
      >
        {nameInputProps.isVerifying
          ? "GPT Validating your name..."
          : "Continue"}
      </S.IntroButton>
    </S.IntroForm>
  );
}
