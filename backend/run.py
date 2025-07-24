import asyncio
import platform
import uvicorn

if __name__ == "__main__":
    if platform.system() == "Windows":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
