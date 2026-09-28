/**
 * Contact Form 7 Multi Step Form
 *
 * 1つのCF7フォーム内にあるSTEP1〜5を
 * JavaScriptで表示切り替えする。
 *
 * 【クライアント側の役割】
 *
 * - STEP表示切り替え
 * - 次へ / 戻る
 * - 入力値保持
 * - 進捗表示
 * - 各STEPの入力チェック
 * - STEP5送信前チェック
 * - 二重送信防止
 * - 送信中のボタン制御
 * - 正常送信後のサンクスページ遷移
 *
 * 最終的な入力チェックは
 * PHP / Contact Form 7側でも行う。
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ==================================================
           Form
        ================================================== */

        const formContainer =
            document.querySelector(
                ".contact-form"
            );


        if (!formContainer) {
            return;
        }


const form =
    formContainer.querySelector(
        "form"
    );


        if (!form) {
            return;
        }


        /* ==================================================
           Elements
        ================================================== */

        const steps =
            Array.from(
                form.querySelectorAll(
                    ".js-form-step"
                )
            );


        const nextButtons =
            form.querySelectorAll(
                ".js-next-step"
            );


        const prevButtons =
            form.querySelectorAll(
                ".js-prev-step"
            );


        const progressStep =
            form.querySelector(
                ".js-progress-step"
            );


        const progressName =
            form.querySelector(
                ".js-progress-name"
            );


        const progressBar =
            form.querySelector(
                ".js-progress-bar"
            );


        const progressDots =
            Array.from(
                form.querySelectorAll(
                    ".contact-progress__steps span"
                )
            );


        const submitButton =
            form.querySelector(
                'input[type="submit"]'
            );


        if (!steps.length) {
            return;
        }


        /*
         * STEP1 = 0
         * STEP2 = 1
         * STEP3 = 2
         * STEP4 = 3
         * STEP5 = 4
         */
        let currentStep = 0;


        /*
         * 二重送信防止用。
         */
        let isSubmitting = false;


        /*
         * 元の送信ボタン文言。
         */
        const originalSubmitText =
            submitButton?.value
            ?? "無料体験を申し込む";


        /* ==================================================
           Error
        ================================================== */

        /**
         * JS側のエラーを削除する。
         */
        const removeErrors = (step) => {

            step
                .querySelectorAll(
                    ".js-step-error"
                )
                .forEach(
                    (error) => {

                        error.remove();

                    }
                );

        };


        /**
         * JS側エラーを表示する。
         */
        const showError = (
            target,
            message
        ) => {

            if (!target) {
                return;
            }


            const error =
                document.createElement("p");


            error.className =
                "contact-field-error js-step-error";


            error.textContent =
                message;


            target.appendChild(error);

        };


        /* ==================================================
           Scroll Error
        ================================================== */

        /**
         * 最初のエラー位置へ移動する。
         */
        const scrollToError = (step) => {

            const error =
                step.querySelector(
                    ".js-step-error"
                );


            if (!error) {
                return;
            }


            error.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });

        };


        /* ==================================================
           Submit State
        ================================================== */

        /**
         * 送信開始。
         */
        const startSubmitting = () => {

            isSubmitting = true;


            if (!submitButton) {
                return;
            }


            submitButton.disabled = true;

            submitButton.value =
                "送信中...";

        };


        /**
         * 送信失敗時などに
         * ボタンを元へ戻す。
         */
        const resetSubmitting = () => {

            isSubmitting = false;


            if (!submitButton) {
                return;
            }


            submitButton.disabled = false;

            submitButton.value =
                originalSubmitText;

        };


        /**
         * 正常送信完了。
         */
        const finishSubmitting = () => {

            isSubmitting = true;


            if (!submitButton) {
                return;
            }


            submitButton.disabled = true;

            submitButton.value =
                "送信しました";

        };


        /* ==================================================
           Validation
        ================================================== */

        const validateCurrentStep = () => {

            const step =
                steps[currentStep];


            removeErrors(step);


            /* ==============================================
               STEP 1
               ご相談内容
            ============================================== */

            if (currentStep === 0) {

                const group =
                    step.querySelector(
                        ".js-consultation-group"
                    );


                const checked =
                    group?.querySelector(
                        'input[type="checkbox"]:checked'
                    );


                if (!checked) {

                    showError(
                        group,
                        "ご相談内容を1つ以上選択してください。"
                    );


                    return false;
                }

            }


            /* ==============================================
               STEP 2 / 3 / 4
               Radio
            ============================================== */

            const radioGroups =
                step.querySelectorAll(
                    ".js-required-radio"
                );


            for (
                const group
                of radioGroups
            ) {

                const checked =
                    group.querySelector(
                        'input[type="radio"]:checked'
                    );


                if (!checked) {

                    showError(
                        group,
                        "選択してください。"
                    );


                    return false;
                }

            }


            /* ==============================================
               STEP 4
               Select
            ============================================== */

            if (currentStep === 3) {

                const requiredSelects =
                    step.querySelectorAll(
                        "select"
                    );


                for (
                    const select
                    of requiredSelects
                ) {

                    if (
                        !select.value
                        ||
                        select.selectedIndex === 0
                    ) {

                        const field =
                            select.closest(
                                ".contact-field"
                            );


                        showError(
                            field,
                            "選択してください。"
                        );


                        return false;
                    }

                }

            }


            /* ==============================================
               STEP 5
               Contact Information
            ============================================== */

            if (currentStep === 4) {

                /* =========================
                   Name
                ========================== */

                const name =
                    step.querySelector(
                        'input[name="your-name"]'
                    );


                if (
                    !name
                    ||
                    !name.value.trim()
                ) {

                    showError(
                        name?.closest(
                            ".contact-field"
                        ) ?? step,
                        "お名前を入力してください。"
                    );


                    return false;
                }


                /* =========================
                   Email
                ========================== */

                const email =
                    step.querySelector(
                        'input[name="your-email"]'
                    );


                if (
                    !email
                    ||
                    !email.value.trim()
                ) {

                    showError(
                        email?.closest(
                            ".contact-field"
                        ) ?? step,
                        "メールアドレスを入力してください。"
                    );


                    return false;
                }


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email.value.trim()
                    )
                ) {

                    showError(
                        email.closest(
                            ".contact-field"
                        ),
                        "正しいメールアドレスを入力してください。"
                    );


                    return false;
                }


                /* =========================
                   Contact Method
                ========================== */

                const contactMethod =
                    step.querySelector(
                        'input[name="contact-method"]:checked'
                    );


                if (!contactMethod) {

                    showError(
                        step.querySelector(
                            ".js-contact-method"
                        ),
                        "希望する連絡方法を選択してください。"
                    );


                    return false;
                }


                /* =========================
                   Telephone
                ========================== */

                const tel =
                    step.querySelector(
                        'input[name="your-tel"]'
                    );


                if (
                    contactMethod.value
                    ===
                    "電話"
                ) {

                    if (
                        !tel
                        ||
                        !tel.value.trim()
                    ) {

                        showError(
                            tel?.closest(
                                ".contact-field"
                            ) ?? step,
                            "電話連絡をご希望の場合は電話番号を入力してください。"
                        );


                        return false;
                    }


                    const telValue =
                        tel.value.replace(
                            /[-\s]/g,
                            ""
                        );


                    const telPattern =
                        /^0\d{9,10}$/;


                    if (
                        !telPattern.test(
                            telValue
                        )
                    ) {

                        showError(
                            tel.closest(
                                ".contact-field"
                            ),
                            "正しい電話番号を入力してください。"
                        );


                        return false;
                    }

                }


                /* =========================
                   Privacy
                ========================== */

                const privacy =
                    step.querySelector(
                        'input[name="privacy-consent"]'
                    );


                if (
                    !privacy
                    ||
                    !privacy.checked
                ) {

                    showError(
                        privacy?.closest(
                            ".contact-field"
                        ) ?? step,
                        "個人情報の取り扱いへの同意が必要です。"
                    );


                    return false;
                }

            }


            return true;

        };


        /* ==================================================
           Render Step
        ================================================== */

        const renderStep = () => {

            steps.forEach(
                (step, index) => {

                    step.hidden =
                        index
                        !==
                        currentStep;

                }
            );


            /* Progress Text */

            if (progressStep) {

                progressStep.textContent =
                    `STEP ${currentStep + 1} / ${steps.length}`;

            }


            if (progressName) {

                progressName.textContent =
                    steps[currentStep]
                        .dataset
                        .stepName
                    ?? "";

            }


            /* Progress Bar */

            if (progressBar) {

                const percentage =
                    (
                        (currentStep + 1)
                        /
                        steps.length
                    )
                    * 100;


                progressBar.style.width =
                    `${percentage}%`;

            }


            /* Progress Dots */

            progressDots.forEach(
                (dot, index) => {

                    dot.classList.toggle(
                        "is-active",
                        index <= currentStep
                    );

                }
            );

        };


        /* ==================================================
           Next
        ================================================== */

        nextButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            !validateCurrentStep()
                        ) {

                            scrollToError(
                                steps[currentStep]
                            );


                            return;
                        }


                        if (
                            currentStep
                            <
                            steps.length - 1
                        ) {

                            currentStep++;


                            renderStep();


                            formContainer
                                .scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });

                        }

                    }
                );

            }
        );


        /* ==================================================
           Previous
        ================================================== */

        prevButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        if (isSubmitting) {
                            return;
                        }


                        if (
                            currentStep > 0
                        ) {

                            removeErrors(
                                steps[currentStep]
                            );


                            currentStep--;


                            renderStep();


                            formContainer
                                .scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });

                        }

                    }
                );

            }
        );


/* ==================================================
   Demo Submit
================================================== */

form.addEventListener(
    "submit",
    (event) => {

        /*
         * 静的デモ版では
         * 実際の送信は行わない。
         */
        event.preventDefault();


        if (isSubmitting) {
            return;
        }


        /*
         * STEP5以外からは送信しない。
         */
        if (
            currentStep
            !==
            steps.length - 1
        ) {
            return;
        }


        /*
         * STEP5入力チェック。
         */
        if (
            !validateCurrentStep()
        ) {

            scrollToError(
                steps[currentStep]
            );


            return;
        }


        isSubmitting =
            true;


        if (submitButton) {

            submitButton.disabled =
                true;


            submitButton.value =
                "デモ送信完了";

        }


        /*
         * 既存の完了メッセージがあれば削除。
         */
        const existingMessage =
            form.querySelector(
                ".js-demo-submit-message"
            );


        if (existingMessage) {

            existingMessage.remove();

        }


        /*
         * デモ完了メッセージ。
         */
        const message =
            document.createElement(
                "div"
            );


        message.className =
            "contact-demo-message js-demo-submit-message";


        message.setAttribute(
            "role",
            "status"
        );


        message.innerHTML = `
            <strong>
                デモフォームの操作確認が完了しました。
            </strong>
            <span>
                ポートフォリオ公開版のため、
                入力内容は送信されません。
            </span>
        `;


        form.appendChild(
            message
        );


        message.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

    }
);


        /* ==================================================
           Initial Display
        ================================================== */

        renderStep();

    }
);