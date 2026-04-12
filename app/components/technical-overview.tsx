export function TechnicalOverview() {
  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 mt-12">
      <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
      <p className="text-gray-400 leading-relaxed">
        The search functionality is implemented using a server action, which searches an array of pre-populated user data. The AsyncSelect
        component sends the search query to the server action, which filters the users based on a{" "}
        <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">startsWith</code>
        {" "}matching strategy. When a user
        is selected from the dropdown, their details are displayed in a card component.
      </p>
    </div>
  )
}

