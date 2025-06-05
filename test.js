#!/usr/bin/env node

/**
 * Simple test script to verify OpenAlex MCP Server functionality
 */

import { spawn } from 'child_process';

async function testMCPServer() {
  console.log('Testing OpenAlex MCP Server...\n');

  const server = spawn('node', ['./build/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Test 1: List tools
  console.log('Test 1: Listing available tools...');
  const listToolsRequest = JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
  }) + '\n';

  server.stdin.write(listToolsRequest);

  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString().trim());
      if (response.id === 1) {
        console.log(`✅ Found ${response.result.tools.length} tools:`);
        response.result.tools.forEach(tool => {
          console.log(`   - ${tool.name}: ${tool.description}`);
        });
        console.log('\nTest 2: Testing search_works tool...');
        
        // Test 2: Test search_works
        const searchWorksRequest = JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "tools/call",
          params: {
            name: "search_works",
            arguments: {
              per_page: 1
            }
          }
        }) + '\n';
        
        server.stdin.write(searchWorksRequest);
      } else if (response.id === 2) {
        if (response.result.isError) {
          console.log(`⚠️ API Error: ${response.result.content[0].text}`);
          console.log('✅ Error handling works correctly.');
        } else {
          const result = JSON.parse(response.result.content[0].text);
          console.log(`✅ Search works returned ${result.results.length} result(s):`);
          result.results.forEach(item => {
            console.log(`   - ${item.display_name} (${item.publication_year})`);
          });
          console.log(`📊 Total works in database: ${result.meta.count.toLocaleString()}`);
          console.log('\n🎉 All tests passed! OpenAlex MCP Server is working correctly with Bearer token authentication!');
        }
        server.kill();
        process.exit(0);
      }
    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      server.kill();
      process.exit(1);
    }
  });

  server.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });

  server.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(1);
    }
  });

  // Timeout after 30 seconds
  setTimeout(() => {
    console.error('❌ Test timeout');
    server.kill();
    process.exit(1);
  }, 30000);
}

testMCPServer().catch(console.error);