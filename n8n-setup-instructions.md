# n8n Setup Instructions

This guide will help you set up n8n using Docker and configure your automated CJ Dropshipping workflow.

## 1. Start n8n Using Docker

1. Open your terminal.
2. Navigate to your project root folder:
   ```bash
   cd c:\Users\Owner\e-commerce
   ```
3. Run the following command to start n8n in the background:
   ```bash
   docker-compose up -d
   ```
4. Once it is running, open your web browser and go to:
   [http://localhost:5678](http://localhost:5678)

## 2. Set Up Your n8n Account

1. When you open n8n for the first time, you will be prompted to set up an owner account.
2. Follow the on-screen instructions to create your account credentials.

## 3. Import the CJ Dropshipping Workflow

1. In the n8n dashboard, click on **Workflows** in the left sidebar.
2. Click the **Add workflow** button in the top right.
3. In the workflow editor, look for the three dots (`...`) in the top right corner and select **Import from File**.
4. Browse your files and select your `n8n-workflow.json` file located in `c:\Users\Owner\e-commerce\n8n-workflow.json`.

## 4. Configure the Workflow

1. With the workflow imported, double-click on the **Get CJ Token** node.
2. Find the `"apiKey": "YOUR_CJ_API_KEY"` field in the JSON parameters.
3. Replace `YOUR_CJ_API_KEY` with your actual live API key from CJ Dropshipping.
4. Save the node settings.

## 5. Get Your Webhook URL

1. Double-click the **Webhook** node (the first node in the workflow).
2. Take note of the **Test URL** or **Production URL** listed there.
3. Open your Next.js project's `.env` file and add this URL as your `N8N_WEBHOOK_URL`:
   ```env
   N8N_WEBHOOK_URL=http://localhost:5678/webhook/new-order
   ```
   *(Make sure the path matches exactly what n8n provides, replacing `localhost` with your actual domain when you deploy).*

## 6. Activate and Test

1. In n8n, if you are using the Test URL, click the **Listen for Test Event** button.
2. Go to your Next.js store and complete a test checkout via PayPal.
3. The checkout should successfully trigger the webhook, and n8n will process the order.
4. Once you are ready for real orders, toggle the switch in the top right corner of the n8n workflow editor to **Active**. This sets it to listen on the Production URL permanently.
