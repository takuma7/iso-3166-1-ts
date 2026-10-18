import ora from 'ora'

export const run = async <T = unknown>(
  text: string,
  promise: Promise<T>,
  options?: {
    succeedText?: string | ((args: { result: T; text: string }) => string)
    failText?: string | ((args: { error: Error; text: string }) => string)
  }
): Promise<T> => {
  const { succeedText, failText } = options || {}
  const spinner = ora(text).start()
  try {
    const result = await promise
    spinner.succeed(
      typeof succeedText === 'undefined'
        ? text
        : typeof succeedText === 'function'
          ? succeedText({ result, text })
          : succeedText
    )
    return result
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    spinner.fail(
      typeof failText === 'undefined'
        ? text
        : typeof failText === 'function'
          ? failText({ error: err, text })
          : failText
    )
    throw err
  }
}
