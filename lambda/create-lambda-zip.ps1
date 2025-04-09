# Create a temporary directory
$tempDir = "temp-lambda"
New-Item -ItemType Directory -Force -Path $tempDir

# Copy necessary files
Copy-Item "stripeWebhook.js" -Destination "$tempDir/"
Copy-Item "package.json" -Destination "$tempDir/"

# Install dependencies in the temp directory
Set-Location $tempDir
npm install --production
Set-Location ..

# Create the zip file
Compress-Archive -Path "$tempDir/*" -DestinationPath "../lambda.zip" -Force

# Clean up
Remove-Item -Recurse -Force $tempDir

Write-Host "Lambda zip file created successfully at ../lambda.zip" 