import validateEnv from './env.validation';

const validators: Record<string, () => void | Promise<void>> = {
  'Environment Variables': validateEnv,
};

async function runValidations() {
  console.log('\n🔍 Running preflight checks...\n');

  for (const [name, fn] of Object.entries(validators)) {
    try {
      await fn();
      console.log(`✅ ${name}: Passed`);
    } catch (error) {
      console.error(`❌ ${name}: Failed`);

      if (error instanceof Error) {
        console.error(`\x1b[31m%s\x1b[0m`, error.message);
      }

      process.exit(1);
    }
  }

  console.log('\n✅ All preflight checks passed!\n');
}

runValidations();
