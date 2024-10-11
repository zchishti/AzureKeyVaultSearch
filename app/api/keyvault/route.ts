import { NextResponse } from "next/server";
import msalInstance from "../../auth/msalconfig-backend";
import { ClientSecretCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { TokenCredential } from "@azure/identity";

class BearerTokenCredential implements TokenCredential {
    constructor(private token: string) {}

    async getToken(): Promise<{ token: string; expiresOnTimestamp: number }> {
        return {
            token: this.token,
            expiresOnTimestamp: Date.now() + 3600 * 1000, // 1 hour expiry
        };
    }
}

export async function POST(req: Request){
    const { keyVaultUri } = await req.json();
    const authorizationHeader = req.headers.get("Authorization");

    if(!keyVaultUri) {
        return NextResponse.json({ error: "Key Vault URI is required" }, { status: 400 });
    }

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authorization header is missing or invalid" }, { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];

    try{
        
        const credential = new BearerTokenCredential(token);
        const client = new SecretClient(keyVaultUri, credential);
        const secretProperties = client.listPropertiesOfSecrets();
        const secrets = [];

        // Fetch the value for each secret
        for await (const secretProperty of secretProperties) {
        const secret = await client.getSecret(secretProperty.name);
            secrets.push({
                name: secret.name,
                value: secret.value,
                status: secret.properties.enabled ? "Enabled" : "Disabled",
            });
        }
        return NextResponse.json({ success: true, secrets , status: 200 });
    }catch(error){
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message, status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred", status: 500 });
        }
    }
}

export async function PUT(req: Request) {
    const { keyVaultUri, secretName, secretValue } = await req.json();
    const authorizationHeader = req.headers.get("Authorization");

    if (!keyVaultUri || !secretName || !secretValue) {
        return NextResponse.json({ error: "Key Vault URI, secret name, and secret value are required" }, { status: 400 });
    }

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authorization header is missing or invalid" }, { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];

    try {
        const credential = new BearerTokenCredential(token);
        const client = new SecretClient(keyVaultUri, credential);
        const result = await client.setSecret(secretName, secretValue);
        console.log(result);
        return NextResponse.json({ success: true, secret: { name: result.name, value: result.value }, status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message , status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred", status: 500 });
        }
    }
}

export async function DELETE(req: Request) {
    const { keyVaultUri, secretName } = await req.json();
    const authorizationHeader = req.headers.get("Authorization");

    if (!keyVaultUri || !secretName) {
        return NextResponse.json({ error: "Key Vault URI and secret name are required" }, { status: 400 });
    }

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Authorization header is missing or invalid" }, { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];

    try {
        const credential = new BearerTokenCredential(token);
        const client = new SecretClient(keyVaultUri, credential);
        await client.beginDeleteSecret(secretName);
        return NextResponse.json({ success: true, message: `Secret ${secretName} deleted successfully`, status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message , status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred", status: 500 });
        }
    }
}