import {Component, createEffect, createMemo, Show} from "solid-js";
import {A, useSubmission} from "@solidjs/router";
import {registerUserHandler} from "~/lib/users";
import {TextField, TextFieldErrorMessage, TextFieldInput} from "~/components/ui/text-field";
import {Button} from "~/components/ui/button";

type PROPS = {}

const RegisterUserForm: Component<PROPS> = props => {
    const submission = useSubmission(registerUserHandler);
    createEffect(() => {
        if (submission.pending) console.log(submission.result, "error", submission.result, "result");
    });

    const results = createMemo(() => {
        return submission.result
    })
    return (
        <>
            <form class={'space-y-4'} action={registerUserHandler} method="post">
                <TextField>
                    <TextFieldInput type="text" required name="firstName" placeholder="First Name"/>
                    <Show when={results()?.error?.firstName}>
                        <TextFieldErrorMessage>
                            {results()?.error?.firstName}
                        </TextFieldErrorMessage>
                    </Show>
                </TextField>
                <TextField>
                    <TextFieldInput type="text" required name="lastName" placeholder="Last Name"/>
                    <Show when={results()?.error?.lastName}>
                        <TextFieldErrorMessage>
                            {results()?.error?.lastName}
                        </TextFieldErrorMessage>
                    </Show>
                </TextField>
                <TextField>
                    <TextFieldInput type="email" required name="email" placeholder="email"/>
                    <Show when={results()?.error?.email}>
                        <TextFieldErrorMessage>
                            {results()?.error?.email}
                        </TextFieldErrorMessage>
                    </Show>
                </TextField>
                <TextField>
                    <TextFieldInput type="password" autocomplete={'none'} required name="password"
                                    placeholder="********"/>
                    <Show when={results()?.error?.password}>
                        <TextFieldErrorMessage>
                            {results()?.error?.password}
                        </TextFieldErrorMessage>
                    </Show>
                </TextField>
                <div class={'flex justify-end space-x-2'}>
                    <Button as={"button"} variant={'default'} type={"submit"}>Register</Button>
                    <Button as={"A"} href={'/'} variant={'secondary'} type={"button"}>Go Back</Button>
                </div>
            </form>


        </>
    );
};

export default RegisterUserForm;