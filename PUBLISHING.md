# Publishing Guide

This guide walks you through publishing the OpenAlex MCP Server to npm.

## Prerequisites

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Ensure you have npm installed and are logged in:
   ```bash
   npm whoami
   # If not logged in:
   npm login
   ```

## Pre-Publishing Checklist

### 1. Update Repository URLs

In `package.json`, replace the placeholder URLs with your actual GitHub repository:

```json
{
  "homepage": "https://github.com/YOUR_USERNAME/openalex-mcp#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/openalex-mcp.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/openalex-mcp/issues"
  }
}
```

### 2. Verify Package Name

Check if the package name `openalex-mcp` is available:
```bash
npm view openalex-mcp
```

If it's taken, you'll need to choose a different name or use a scoped package like `@yourusername/openalex-mcp`.

### 3. Build and Test

```bash
# Build the project
npm run build

# Test the build
npm run inspector

# Run basic tests
node test-simple.js
```

### 4. Version Management

Follow semantic versioning:
- **Patch** (0.1.1): Bug fixes
- **Minor** (0.2.0): New features, backward compatible
- **Major** (1.0.0): Breaking changes

Update version:
```bash
npm version patch  # or minor, major
```

## Publishing Steps

### 1. Dry Run

Test the publishing process without actually publishing:
```bash
npm publish --dry-run
```

This will show you what files will be included in the package.

### 2. Publish to npm

```bash
npm publish
```

For the first publish, you might need to verify your email or enable 2FA if required.

### 3. Verify Publication

Check your package on npm:
```bash
npm view openalex-mcp
```

Or visit: https://www.npmjs.com/package/openalex-mcp

## Post-Publishing

### 1. Update README

Update the README.md with the correct installation instructions using your actual package name.

### 2. Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v0.1.0`
4. Release title: `v0.1.0 - Initial Release`
5. Describe the features and changes

### 3. Update Documentation

Ensure all documentation reflects the published package name and installation method.

## Updating the Package

For future updates:

1. Make your changes
2. Update version: `npm version patch|minor|major`
3. Build: `npm run build`
4. Test: `npm run inspector`
5. Publish: `npm publish`

## Troubleshooting

### Common Issues

1. **Package name taken**: Use a scoped package `@yourusername/openalex-mcp`
2. **Permission denied**: Ensure you're logged in with `npm login`
3. **2FA required**: Enable two-factor authentication on your npm account
4. **Build files missing**: Ensure `npm run build` completes successfully

### Package Scoping

If the package name is taken, update `package.json`:

```json
{
  "name": "@yourusername/openalex-mcp",
  // ... rest of config
}
```

Then publish with:
```bash
npm publish --access public
```

## Best Practices

1. **Always test before publishing**: Use `npm publish --dry-run`
2. **Use semantic versioning**: Follow semver for version numbers
3. **Write good commit messages**: They help with changelog generation
4. **Tag releases**: Use Git tags for versions
5. **Keep dependencies updated**: Regularly update dependencies for security

## Support

If you encounter issues:
1. Check the [npm documentation](https://docs.npmjs.com/)
2. Review the package.json configuration
3. Ensure all required files are included in the build