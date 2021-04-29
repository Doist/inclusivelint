#!/usr/bin/env node
import { Program } from './program'
import * as core from '@actions/core'

// entrypoint
if (process.env.CI === 'true') {
    try {
        let args: string[] = core.getInput('args').split(' ')
        args = args.map((arg) =>
            arg.replace(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, (name: string) => {
                return process.env[name.substring(1)] ?? name
            }),
        )
        new Program(args).Run()
    } catch (error) {
        core.setFailed(error.message)
    }
} else {
    new Program(process.argv).Run()
}
