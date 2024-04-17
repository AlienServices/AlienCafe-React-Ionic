import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignIn } from "@clerk/clerk-react";


export default function SignInScreen() {
    // {  setSignToggle }: {setSignToggle: () => void}

    const { signIn, setActive, isLoaded } = useSignIn();

    const [emailAddress, setEmailAddress] = React.useState("kalehamm@copiersutah.com");
    const [password, setPassword] = React.useState("alien");

    const onSignInPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            console.log(emailAddress, password, "these are good data")
            const completeSignIn = await signIn.create({
                identifier: emailAddress,
                password,
            });
            // This is an important step,
            // This indicates the user is signed in            
            await setActive({ session: completeSignIn.createdSessionId });
        } catch (err: any) {
            console.log(err);
        }
    };
    return (
        <View>
            <View>
                <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Email..."
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />
            </View>

            <View>

                <TextInput
                    value={password}
                    placeholder="Password..."
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <TouchableOpacity onPress={() => onSignInPress()}>
                <Text>Log In Here</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Sign Up Page</Text>
            </TouchableOpacity>
        </View>
    );
}