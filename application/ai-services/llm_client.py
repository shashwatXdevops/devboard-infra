def generate_summary(content: str) -> str:
    """Mock LLM client that returns a dummy markdown summary."""
    return f"**Mock Summary**: This is a generated summary for the provided content:\n\n{content}\n\n*End of mock summary.*"
